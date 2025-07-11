import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientPlanCommentsResolver } from 'src/modules/patients/patient-plans/adapters/in/web/patient-plans-comments.resolver';
import { PatientPlansWebResolver } from 'src/modules/patients/patient-plans/adapters/in/web/patient-plans-web.resolver';
import { PatientPlanCommentPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plan-comment-persistence.service';
import { PatientPlan, PatientPlanSchema } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { PatientPlansPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plans-persistence.service';
import { AddPatientPlanCommentService } from 'src/modules/patients/patient-plans/application/add-patient-plan-comment.service';
import { CreatePatientPlanManagerService } from 'src/modules/patients/patient-plans/application/create-patient-plan-manager.service';
import { PatientsModule } from 'src/modules/patients/patients/patients.module';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { PatientPlanNutritionalMealsPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plan-meals-persistence.service';
import { PatientPlanMealsResolver } from 'src/modules/patients/patient-plans/adapters/in/web/patient-plan-meals.resolver';
import { DuplicatePatientPlanService } from 'src/modules/patients/patient-plans/application/duplicate-patient-plan.service';
import { AuthModule } from 'src/modules/auth/auth/auth.module';
import { AddPlanMealService } from 'src/modules/patients/patient-plans/application/add-plan-meal.service';
import { PatientPlansMobileResolver } from 'src/modules/patients/patient-plans/adapters/in/mobile/patient-plans-mobile.resolver';
import { GetPatientPlansManagerService } from 'src/modules/patients/patient-plans/application/get-patient-plans-manager.service';

const resolvers = [PatientPlansWebResolver, PatientPlansMobileResolver, PatientPlanCommentsResolver, PatientPlanMealsResolver];
const persistenceServices = [
  PatientPlansPersistenceService,
  PatientPlanCommentPersistenceService,
  PatientPlanNutritionalMealsPersistenceService,
];
const applicationServices = [
  CreatePatientPlanManagerService,
  AddPatientPlanCommentService,
  DuplicatePatientPlanService,
  AddPlanMealService,
  GetPatientPlansManagerService,
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PatientPlan.name, schema: PatientPlanSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => ProfessionalsModule),
    forwardRef(() => PatientsModule),
  ],
  providers: [...resolvers, ...persistenceServices, ...applicationServices],
  exports: [CreatePatientPlanManagerService, GetPatientPlansManagerService],
})
export class PatientPlansModule {}
