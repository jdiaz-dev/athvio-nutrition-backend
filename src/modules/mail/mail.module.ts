import { Module } from '@nestjs/common';
import { EmailTemplatesService } from 'src/modules/mail/adapters/out/mail-templates.service';
import { MailService } from 'src/modules/mail/adapters/out/mail.service';

@Module({
  providers: [MailService, EmailTemplatesService],
  exports: [EmailTemplatesService],
})
export class MailModule {}
