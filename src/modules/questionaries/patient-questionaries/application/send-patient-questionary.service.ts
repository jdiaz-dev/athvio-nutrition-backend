import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/modules/mail/adapters/out/mail.service';
import { GetPatientManagerService } from 'src/modules/patients/patients/application/get-patient-manager.service';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';
import { SendPatientQuestionaryDto } from 'src/modules/questionaries/patient-questionaries/adapters/in/dtos/send-patient-questionary.dto';
import { PatientQuestionaryPersistenceService } from 'src/modules/questionaries/patient-questionaries/adapters/out/patient-questionary-persistence.service';
import { ErrorPatientQuestionaryEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class SendPatientQuestionaryService {
  constructor(
    private readonly configService: ConfigService,
    private readonly pqps: PatientQuestionaryPersistenceService,
    private readonly pms: ProfessionalsManagementService,
    private readonly gpms: GetPatientManagerService,
    private readonly ms: MailService,
  ) {}

  async sendPatientQuestionary({ questionary: _id, patient, professional }: SendPatientQuestionaryDto): Promise<boolean> {
    const questionary = await this.pqps.getPatientQuestionary({ _id, patient, professional });
    if (!questionary) throw new BadRequestException(ErrorPatientQuestionaryEnum.NOT_FOUND);

    const patientRes = await this.gpms.getPatient(patient, professional);
    const { user } = await this.pms.getProfessionalById(professional);

    const origin = this.configService.get<string[]>('whiteListOrigins')[0];
    const url = `${origin}/form/${_id}`;
    const mailTitle = `Assessment form from ${user.firstname} ${user.lastname}`;
    const message = `
      Hi ${patientRes.user.firstname},

      Before we begin the nutritional counseling, I would like you to answer a few questions regarding your health, lifestyle and eating habits.

      These answers will be added to your profile so I can better prepare your nutritional counseling and understand your goals and needs.

      Please fill in this questionnaire as soon as possible: ${url}
      
      - Your Coach,
      ${user.firstname} ${user.lastname}
    `;
    await this.ms.sendEmail({
      from: this.configService.get<string>('mailsSender'),
      to: [patientRes.user.email],
      subject: mailTitle,
      message,
    });
    return true;
  }
}
