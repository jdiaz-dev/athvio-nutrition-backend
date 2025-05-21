import { Module } from '@nestjs/common';
import { PatientQuestionaryModule } from 'src/modules/questionaries/patient-questionaries/patient-questionary.module';

@Module({
  imports: [PatientQuestionaryModule],
})
export class QuestionaryDomainsModule {}
