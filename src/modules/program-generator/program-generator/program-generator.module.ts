import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth/auth.module';
import { PatientPlansModule } from 'src/modules/patients/patient-plans/patient-plans.module';
import { DiseaseCausesModule } from 'src/modules/program-generator/disease-causes/disease-causes.module';
import { DiseasesModule } from 'src/modules/program-generator/diseases/diseases.module';
import { AIproviderModule } from 'src/modules/program-generator/artificial-intelligence/ai-provider.module';
import { NutritionalPreferencesModule } from 'src/modules/program-generator/nutritional-preferences/nutritional-preferences.module';
import { ProgramGeneratorResolver } from 'src/modules/program-generator/program-generator/adapters/in/program-generator.resolver';
import { GeneratorManagerService } from 'src/modules/program-generator/program-generator/application/generator-manager.service';
import { NutritionalPlanGeneratorService } from 'src/modules/program-generator/program-generator/application/nutritional-plan-generator.service';
import { SharedModule } from 'src/shared/shared.module';
import { WorkFlowStreamAuditModule } from 'src/modules/backoffice/work-steram-audit/work-flow-stream-audit.module';

@Module({
  imports: [
    AuthModule,
    SharedModule,
    DiseaseCausesModule,
    DiseasesModule,
    NutritionalPreferencesModule,
    AIproviderModule,
    PatientPlansModule,
    WorkFlowStreamAuditModule,
  ],
  providers: [ProgramGeneratorResolver, NutritionalPlanGeneratorService, GeneratorManagerService],
})
export class ProgramGeneratorModule {}
