import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { MailService } from 'src/modules/mail/adapters/out/mail.service';

@Module({
  imports: [SharedModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
