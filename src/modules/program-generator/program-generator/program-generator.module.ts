import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/modules/authentication/authentication/authentication.module';
import { DiseaseCausesModule } from 'src/modules/program-generator/disease-causes/disease-causes.module';
import { DiseasesModule } from 'src/modules/program-generator/diseases/diseases.module';
import { GptModule } from 'src/modules/program-generator/gpt/gpt.module';
import { NutritionalPreferencesModule } from 'src/modules/program-generator/nutritional-preferences/nutritional-preferences.module';
import { ProgramGeneratorResolver } from 'src/modules/program-generator/program-generator/adapters/in/program-generator.resolver';
import { GeneratorManagerService } from 'src/modules/program-generator/program-generator/application/generator-manager.service';
import { NutritionalPlanGeneratorService } from 'src/modules/program-generator/program-generator/application/nutritional-plan-generator.service';

@Module({
  imports: [AuthenticationModule, DiseaseCausesModule, DiseasesModule, NutritionalPreferencesModule, GptModule],
  providers: [ProgramGeneratorResolver, NutritionalPlanGeneratorService, GeneratorManagerService],
})
export class ProgramGeneratorModule {}
