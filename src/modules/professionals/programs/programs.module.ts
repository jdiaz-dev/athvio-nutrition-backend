import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientPlansModule } from 'src/modules/patients/patient-plans/patient-plans.module';
import { PatientsModule } from 'src/modules/patients/patients/patients.module';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { ProgramTagsModule } from 'src/modules/professionals/program-tags/program-tags.module';
import { MealsResolver } from 'src/modules/professionals/programs/adapters/in/meals.resolver';
import { PlansResolver } from 'src/modules/professionals/programs/adapters/in/plans.resolver';
import { ProgramsResolver } from 'src/modules/professionals/programs/adapters/in/programs.resolver';
import { NutritionalMealsPersistenceService } from 'src/modules/professionals/programs/adapters/out/meals-persistence.service';
import { PlansPersistenceService } from 'src/modules/professionals/programs/adapters/out/plans-persistence.service';
import { Program, ProgramSchema } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ProgramsPersistenceService } from 'src/modules/professionals/programs/adapters/out/programs-persistence.service';
import { AssignProgramService } from 'src/modules/professionals/programs/application/assign-program.service';
import { ProgramPlanManagementService } from 'src/modules/professionals/programs/application/program-plan-management.service';
import { ProgramManagementService } from 'src/modules/professionals/programs/application/program-management.service';
import { AuthenticationModule } from 'src/modules/auth/auth/authentication.module';
import { SharedModule } from 'src/shared/shared.module';

const resolvers = [ProgramsResolver, PlansResolver, MealsResolver];
const services = [
  ProgramsPersistenceService,
  ProgramManagementService,
  PlansPersistenceService,
  NutritionalMealsPersistenceService,
  AssignProgramService,
  ProgramPlanManagementService,
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Program.name, schema: ProgramSchema }]),
    SharedModule,
    AuthenticationModule,
    ProfessionalsModule,
    ProgramTagsModule,
    PatientsModule,
    PatientPlansModule,
  ],
  providers: [...resolvers, ...services],
})
export class ProgramsModule {}
