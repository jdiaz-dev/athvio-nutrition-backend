import { Injectable, InternalServerErrorException } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { EmailProviderService } from 'src/modules/mail/adapters/out/mail-provider.service';
import { ErrorMailService } from 'src/shared/enums/messages-response';
import { LayersServer } from 'src/shared/enums/project';

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly logger: AthvioLoggerService) {
    this.transporter = nodemailer.createTransport({
      SES: { sesClient: EmailProviderService.sesClient, SendEmailCommand: EmailProviderService.sendCommand },
    });
  }

  async sendEmail(options: {
    from: string;
    to: string[];
    subject: string;
    message: string;
    attachedFileOptions?: { fileName: string; content: Buffer | string; contentType: string };
  }): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.message,
      });
      return true;
    } catch (error: unknown) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, message: (error as Error).message, error });
      throw new InternalServerErrorException(ErrorMailService.SEND_MAIL);
    }
  }
}
