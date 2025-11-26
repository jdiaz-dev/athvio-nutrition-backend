import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientPlansModule } from 'src/modules/patients/patient-plans/patient-plans.module';
import { PatientsModule } from 'src/modules/patients/patients/patients.module';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { ProgramTagsModule } from 'src/modules/professionals/program-tags/program-tags.module';
import { MealsResolver } from 'src/modules/professionals/programs/adapters/in/meals.resolver';
import { PlansResolver } from 'src/modules/professionals/programs/adapters/in/plans.resolver';
import { ProgramsResolver } from 'src/modules/professionals/programs/adapters/in/programs.resolver';
import { MealsPersistenceService } from 'src/modules/professionals/programs/adapters/out/meals-persistence.service';
import { PlansPersistenceService } from 'src/modules/professionals/programs/adapters/out/plans-persistence.service';
import { Program, ProgramSchema } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ProgramsPersistenceService } from 'src/modules/professionals/programs/adapters/out/programs-persistence.service';
import { AssignProgramService } from 'src/modules/professionals/programs/application/assign-program.service';
import { ProgramPlanManagerService } from 'src/modules/professionals/programs/application/program-plan-manager.service';
import { ProgramManagerService } from 'src/modules/professionals/programs/application/program-manager.service';
import { AuthModule } from 'src/modules/auth/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { PlanMealsManagerService } from 'src/modules/professionals/programs/application/plan-meals-manager.service';
import { ProgramMealImageManagerService } from 'src/modules/professionals/programs/application/program-meal-image-manager.service';

const resolvers = [ProgramsResolver, PlansResolver, MealsResolver];
const services = [
  ProgramsPersistenceService,
  ProgramManagerService,
  PlansPersistenceService,
  MealsPersistenceService,
  AssignProgramService,
  ProgramPlanManagerService,
  PlanMealsManagerService,
  ProgramMealImageManagerService,
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Program.name, schema: ProgramSchema }]),
    forwardRef(() => AuthModule),
    SharedModule,
    forwardRef(() => ProfessionalsModule),
    ProgramTagsModule,
    forwardRef(() => PatientsModule),
    PatientPlansModule,
  ],
  providers: [...resolvers, ...services],
  exports: [ProgramManagerService, AssignProgramService],
})
export class ProgramsModule {}
