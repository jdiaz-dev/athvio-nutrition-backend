import { Module } from '@nestjs/common';
import { NutritionalMealsModule } from 'src/modules/professionals/nutritional-meals/nutritional-meals.module';
import { PatientGroupsModule } from 'src/modules/professionals/patient-groups/patient-groups.module';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { ProgramTagsModule } from 'src/modules/professionals/program-tags/program-tags.module';
import { ProgramsModule } from 'src/modules/professionals/programs/programs.module';
import { QuestionaryConfigurationModule } from 'src/modules/professionals/questionary-configuration/questionary-configuration.module';

@Module({
  imports: [
    QuestionaryConfigurationModule,
    ProfessionalsModule,
    ProgramsModule,
    ProgramTagsModule,
    PatientGroupsModule,
    NutritionalMealsModule,
  ],
  exports: [],
})
export class ProfessionalDomainsModule {}
