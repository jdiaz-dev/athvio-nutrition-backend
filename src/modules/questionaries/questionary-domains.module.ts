import { Module } from '@nestjs/common';
import { ProfessionalQuestionariesModule } from 'src/modules/questionaries/professional-questionaries/professional-questionaries.module';
import { QuestionaryModule } from 'src/modules/questionaries/questionary/questionary.module';

@Module({
  imports: [QuestionaryModule, ProfessionalQuestionariesModule],
})
export class QuestionaryDomainsModule {}
