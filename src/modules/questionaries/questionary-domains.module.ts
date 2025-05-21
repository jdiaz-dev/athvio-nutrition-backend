import { Module } from '@nestjs/common';
import { QuestionaryConfigurationModule } from 'src/modules/questionaries/questionary-configuration/questionary-configuration.module';
import { PatientQuestionaryModule } from 'src/modules/questionaries/patient-questionaries/patient-questionary.module';
import { QuestionaryModule } from 'src/modules/questionaries/questionary/questionary.module';

@Module({
  imports: [QuestionaryModule, QuestionaryConfigurationModule, PatientQuestionaryModule],
})
export class QuestionaryDomainsModule {}
