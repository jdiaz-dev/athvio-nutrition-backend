import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/modules/mail/adapters/out/mail.service';

@Injectable()
export class EmailTemplatesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly ms: MailService,
  ) {}

  async sendInvitationPatientEmail(
    professionalFirstname: string,
    professionalLastname: string,
    patientUserId: string,
    patientEmail: string,
    patientFirstname: string,
  ): Promise<void> {
    const origin = this.configService.get<string[]>('whiteListOrigins')[1];
    const url = `${origin}/activate/${patientUserId}`;
    const mailTitle = `Invitación de ${professionalFirstname} ${professionalLastname}`;
    const message = `
      Hola ${patientFirstname},
      
      Te invito a usar Athvio. ¡Te ayudará a recibir tus planes nutricionales y a conversar conmigo!
      
      - Tu Coach,
      ${professionalFirstname} ${professionalLastname}
      ${url}
    `;
    await this.ms.sendEmail({
      from: this.configService.getOrThrow<string>('mailsSender'),
      to: [patientEmail],
      subject: mailTitle,
      message,
    });
  }
  async sendPatientQuestionaryMail({
    questionary,
    patient,
    professional,
    professionalFirstName,
    professionalLastName,
    patientFirstName,
    patientEmail,
  }: {
    questionary: string;
    patient: string;
    professional: string;
    professionalFirstName: string;
    professionalLastName: string;
    patientFirstName: string;
    patientEmail: string;
  }): Promise<boolean> {
    const patientWebOrigin = this.configService.get<string[]>('whiteListOrigins')[1];
    const url = `${patientWebOrigin}/questionary?patientQuestionary=${questionary}&patient=${patient}&professional=${professional}`;
    const mailTitle = `Formulario de evaluación de estado actual de salud - ${professionalFirstName} ${professionalLastName}`;
    const message = `
        Hola ${patientFirstName},
  
        Antes de empezar con la consulta, me gustaría que respondieras algunas preguntas sobre tu salud, estilo de vida y hábitos alimenticios.
  
        Estas respuestas se agregarán a tu historial para que se pueda entender mejor tu estado actual, necesidades y objetivos.
  
        Por favor, completa este cuestionario lo antes posible: ${url}
        
        - Tu Coach,
        ${professionalFirstName} ${professionalLastName}
      `;
    await this.ms.sendEmail({
      from: this.configService.get<string>('mailsSender'),
      to: [patientEmail],
      subject: mailTitle,
      message,
    });
    return true;
  }
}
