import { Module } from '@nestjs/common';
import { NutritionalMealsModule } from 'src/modules/professionals/nutritional-meals/nutritional-meals.module';
import { PatientGroupsModule } from 'src/modules/professionals/patient-groups/patient-groups.module';
import { ProfessionalQuestionariesModule } from 'src/modules/professionals/professional-questionaries/professional-questionaries.module';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { ProgramTagsModule } from 'src/modules/professionals/program-tags/program-tags.module';
import { ProgramsModule } from 'src/modules/professionals/programs/programs.module';

@Module({
  imports: [
    ProfessionalsModule,
    ProfessionalQuestionariesModule,
    ProgramsModule,
    ProgramTagsModule,
    PatientGroupsModule,
    NutritionalMealsModule,
  ],
})
export class ProfessionalDomainsModule {}
