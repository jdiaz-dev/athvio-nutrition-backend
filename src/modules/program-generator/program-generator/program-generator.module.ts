import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth/auth.module';
import { PatientPlansModule } from 'src/modules/patients/patient-plans/patient-plans.module';
import { DiseaseCausesModule } from 'src/modules/program-generator/disease-causes/disease-causes.module';
import { DiseasesModule } from 'src/modules/program-generator/diseases/diseases.module';
import { GptModule } from 'src/modules/program-generator/gpt/gpt.module';
import { NutritionalPreferencesModule } from 'src/modules/program-generator/nutritional-preferences/nutritional-preferences.module';
import { ProgramGeneratorResolver } from 'src/modules/program-generator/program-generator/adapters/in/program-generator.resolver';
import { GeneratorManagerService } from 'src/modules/program-generator/program-generator/application/generator-manager.service';
import { NutritionalPlanGeneratorService } from 'src/modules/program-generator/program-generator/application/nutritional-plan-generator.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    AuthModule,
    SharedModule,
    DiseaseCausesModule,
    DiseasesModule,
    NutritionalPreferencesModule,
    GptModule,
    PatientPlansModule,
  ],
  providers: [ProgramGeneratorResolver, NutritionalPlanGeneratorService, GeneratorManagerService],
})
export class ProgramGeneratorModule {}
