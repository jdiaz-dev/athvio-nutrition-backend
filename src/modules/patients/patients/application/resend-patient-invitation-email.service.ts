import { Injectable } from '@nestjs/common';
import { PatientsPersistenceService } from 'src/modules/patients/patients/adapters/out/patients-persistence.service';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';
import { EmailTemplatesService } from 'src/modules/mail/adapters/out/mail-templates.service';
import { ConfigService } from '@nestjs/config';
import { ResendPatientInvitationEmailDto } from 'src/modules/patients/patients/adapters/in/web/dtos/resend-patient-invitation-email.dto';

@Injectable()
export class ResendPatientInvitationEmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prms: ProfessionalsManagementService,
    private pps: PatientsPersistenceService,
    private readonly ets: EmailTemplatesService,
  ) {}

  async resendPatientInvitationEmail({ professional, patient }: ResendPatientInvitationEmailDto): Promise<boolean> {
    const isProductionTesterProfessionalId = this.configService.get<string>('productionTesterProfessionalId') === professional;

    if (!isProductionTesterProfessionalId) {
      const { user } = await this.prms.getProfessionalByUuid(professional, {
        'uuid': 1,
        'user.uuid': 1,
        'user.firstname': 1,
        'user.lastname': 1,
      });
      const _patient = await this.pps.getPatientPopulatedWithUser(
        { uuid: patient },
        { '_id': 1, 'user.uuid': 1, 'user.email': 1, 'user.firstname': 1 },
      );
      await this.ets.sendInvitationPatientEmail(
        user.firstname,
        user.lastname,
        _patient.user.uuid,
        _patient.user.email,
        _patient.user.firstname,
      );
      return true;
    }
    return false;
  }
}
