import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/modules/mail/adapters/out/mail.service';
import { GetPatientManagerService } from 'src/modules/patients/patients/application/get-patient-manager.service';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';
import { SendPatientQuestionaryDto } from 'src/modules/patients/patient-questionaries/adapters/in/web/dtos/send-patient-questionary.dto';
import { PatientInternalQuestionaryPersistenceService } from 'src/modules/patients/patient-questionaries/adapters/out/patient-questionary-persistence.service';
import { ErrorPatientQuestionaryEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class SendPatientQuestionaryService {
  constructor(
    private readonly configService: ConfigService,
    private readonly pqps: PatientInternalQuestionaryPersistenceService,
    private readonly pms: ProfessionalsManagementService,
    private readonly gpms: GetPatientManagerService,
    private readonly ms: MailService,
  ) {}

  async sendPatientQuestionary({ questionary, patient, professional }: SendPatientQuestionaryDto): Promise<boolean> {
    const patientQuestionary = await this.pqps.getPatientQuestionary({ uuid: questionary, patient, professional });
    if (!patientQuestionary) throw new BadRequestException(ErrorPatientQuestionaryEnum.NOT_FOUND);

    const patientRes = await this.gpms.getPatient(patient, professional);
    const { user } = await this.pms.getProfessionalByUuid(professional);

    const patientWebOrigin = this.configService.get<string[]>('whiteListOrigins')[1];
    const url = `${patientWebOrigin}/questionary?patientQuestionary=${questionary}&patient=${patient}&professional=${professional}`;
    console.log('url', url);
    const mailTitle = `Formulario de evaluación de estado actual de salud - ${user.firstname} ${user.lastname}`;
    const message = `
      Hola ${patientRes.user.firstname},

      Antes de empezar con la consulta, me gustaría que respondieras algunas preguntas sobre tu salud, estilo de vida y hábitos alimenticios.

      Estas respuestas se agregarán a tu historial para que se pueda entender mejor tu estado actual, necesidades y objetivos.

      Por favor, completa este cuestionario lo antes posible: ${url}
      
      - Tu Coach,
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
