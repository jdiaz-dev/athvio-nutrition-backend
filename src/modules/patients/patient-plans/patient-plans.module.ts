import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientPlanCommentsResolver } from 'src/modules/patients/patient-plans/adapters/in/web/patient-plans-comments.resolver';
import { PatientPlansWebResolver } from 'src/modules/patients/patient-plans/adapters/in/web/patient-plans-web.resolver';
import { PatientPlanCommentPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plan-comment-persistence.service';
import { PatientPlan, PatientPlanSchema } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { PatientPlansPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plans-persistence.service';
import { AddPatientPlanCommentService } from 'src/modules/patients/patient-plans/application/add-patient-plan-comment.service';
import { CreatePatientPlanService } from 'src/modules/patients/patient-plans/application/create-patient-plan.service';
import { PatientsModule } from 'src/modules/patients/patients/patients.module';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { PatientPlanMealsPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plan-meals-persistence.service';
import { PatientPlanMealsResolver } from 'src/modules/patients/patient-plans/adapters/in/web/patient-plan-meals.resolver';
import { DuplicatePatientPlanService } from 'src/modules/patients/patient-plans/application/duplicate-patient-plan.service';
import { AuthenticationModule } from 'src/modules/authentication/authentication/authentication.module';
import { AddPlanMealService } from 'src/modules/patients/patient-plans/application/add-plan-meal.service';
import { SharedModule } from 'src/shared/shared.module';
import { PatientPlansMobileResolver } from 'src/modules/patients/patient-plans/adapters/in/mobile/patient-plans-mobile.resolver';
import { GetPatientPlansManagerService } from 'src/modules/patients/patient-plans/application/get-patient-plans-manager.service';

const resolvers = [PatientPlansWebResolver, PatientPlansMobileResolver, PatientPlanCommentsResolver, PatientPlanMealsResolver];
const persistenceServices = [
  PatientPlansPersistenceService,
  PatientPlanCommentPersistenceService,
  PatientPlanMealsPersistenceService,
];
const applicationServices = [
  CreatePatientPlanService,
  AddPatientPlanCommentService,
  DuplicatePatientPlanService,
  AddPlanMealService,
  GetPatientPlansManagerService,
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PatientPlan.name, schema: PatientPlanSchema }]),
    SharedModule,
    AuthenticationModule,
    ProfessionalsModule,
    PatientsModule,
  ],
  providers: [...resolvers, ...persistenceServices, ...applicationServices],
  exports: [PatientPlansPersistenceService],
})
export class PatientPlansModule {}
