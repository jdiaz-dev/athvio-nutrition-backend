import { Module } from '@nestjs/common';
import { InternalQuestionaryModule } from 'src/modules/backoffice/internal-questionary/internal-questionary.module';

@Module({
  imports: [InternalQuestionaryModule],
})
export class BackofficeDomainsModule {}
