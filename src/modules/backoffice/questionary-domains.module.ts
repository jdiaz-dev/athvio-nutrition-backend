import { Module } from '@nestjs/common';
import { QuestionaryModule } from 'src/modules/backoffice/internal-questionary/questionary.module';

@Module({
  imports: [QuestionaryModule],
})
export class QuestionaryDomainsModule {}
