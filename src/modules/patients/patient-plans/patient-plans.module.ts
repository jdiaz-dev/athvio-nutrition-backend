import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientPlanCommentsResolver } from 'src/modules/patients/patient-plans/adapters/in/patient-plans-comments.resolver';
import { PatientPlansResolver } from 'src/modules/patients/patient-plans/adapters/in/patient-plans.resolver';
import { PatientPlanCommentPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plan-comment-persistence.service';
import { PatientPlan, PatientPlanSchema } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { PatientPlansPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plans-persistence.service';
import { AddPatientPlanCommentService } from 'src/modules/patients/patient-plans/application/add-patient-plan-comment.service';
import { CreatePatientPlanService } from 'src/modules/patients/patient-plans/application/create-patient-plan.service';
import { PatientsModule } from 'src/modules/patients/patients/patients.module';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { PatientPlanMealsPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plan-meals-persistence.service';
import { MealsResolver } from 'src/modules/patients/patient-plans/adapters/in/patient.resolver';
import { DuplicatePatientPlanService } from 'src/modules/patients/patient-plans/application/duplicate-patient-plan.service';
import { AuthenticationModule } from 'src/modules/authentication/authentication/authentication.module';

const resolvers = [PatientPlansResolver, PatientPlanCommentsResolver, MealsResolver];
const services = [
  PatientPlansPersistenceService,
  CreatePatientPlanService,
  PatientPlanCommentPersistenceService,
  AddPatientPlanCommentService,
  PatientPlanMealsPersistenceService,
  DuplicatePatientPlanService
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PatientPlan.name, schema: PatientPlanSchema }]),
    AuthenticationModule,
    ProfessionalsModule,
    PatientsModule,
    
  ],
  providers: [...resolvers, ...services],
  exports: [PatientPlansPersistenceService]
})
export class PatientPlansModule {}
