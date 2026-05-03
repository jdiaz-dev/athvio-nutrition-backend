import { BadRequestException, Injectable } from '@nestjs/common';
import { GetPatientManagerService } from 'src/modules/patients/patients/application/get-patient-manager.service';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';
import { SendPatientQuestionaryDto } from 'src/modules/patients/patient-questionaries/adapters/in/web/dtos/send-patient-questionary.dto';
import { PatientInternalQuestionaryPersistenceService } from 'src/modules/patients/patient-questionaries/adapters/out/patient-questionary-persistence.service';
import { ErrorPatientQuestionaryEnum } from 'src/shared/enums/messages-response';
import { EmailTemplatesService } from 'src/modules/mail/adapters/out/mail-templates.service';

@Injectable()
export class SendPatientQuestionaryService {
  constructor(
    private readonly pqps: PatientInternalQuestionaryPersistenceService,
    private readonly pms: ProfessionalsManagementService,
    private readonly gpms: GetPatientManagerService,
    private readonly ets: EmailTemplatesService,
  ) {}

  async sendPatientQuestionary({ questionary, patient, professional }: SendPatientQuestionaryDto): Promise<boolean> {
    const patientQuestionary = await this.pqps.getPatientQuestionary({ uuid: questionary, patient, professional });
    if (!patientQuestionary) throw new BadRequestException(ErrorPatientQuestionaryEnum.NOT_FOUND);

    const patientRes = await this.gpms.getPatient(patient, professional);
    const { user } = await this.pms.getProfessionalByUuid(professional);

    await this.ets.sendPatientQuestionaryMail({
      questionary,
      patient,
      professional,
      professionalFirstName: user.firstname,
      professionalLastName: user.lastname,
      patientFirstName: patientRes.user.firstname,
      patientEmail: patientRes.user.email,
    });

    return true;
  }
}
