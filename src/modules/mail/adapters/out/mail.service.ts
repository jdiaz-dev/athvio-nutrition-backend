import { Injectable, InternalServerErrorException } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { EmailProviderService } from 'src/modules/mail/adapters/out/mail-provider.service';
import { ErrorMailService } from 'src/shared/enums/messages-response';

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      SES: { ses: EmailProviderService.sesClient, aws: { SendRawEmailCommand: EmailProviderService.sendCommand } },
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
    } catch (error) {
      console.log('------error', error);
      throw new InternalServerErrorException(ErrorMailService.SEND_MAIL);
    }
  }
}
