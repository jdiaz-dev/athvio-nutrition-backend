import { Module } from '@nestjs/common';
import { MailService } from 'src/modules/mail/adapters/out/mail.service';

@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
