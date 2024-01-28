import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePatientPlanDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/plan/create-patient-plan.dto';
import { DeletePatientPlanDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/plan/delete-patient-plan.dto';
import { DuplicatePatientPlanDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/plan/duplicate-patient-plan.dto';
import { GetPatientPlansDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/plan/get-patient-plans.dto';
import { UpdatePatientPlanDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/plan/update-patient-plan.dto';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { PatientPlansPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plans-persistence.service';
import { CreatePatientPlanService } from 'src/modules/patients/patient-plans/application/create-patient-plan.service';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractor, selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { DuplicatePatientPlanService } from 'src/modules/patients/patient-plans/application/duplicate-patient-plan.service';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class PatientPlansResolver {
  constructor(
    private readonly cpps: PatientPlansPersistenceService,
    private ccps: CreatePatientPlanService,
    private dcps: DuplicatePatientPlanService) {}

  @Mutation(() => PatientPlan)
  createPatientPlan(@Args('input') dto: CreatePatientPlanDto): Promise<PatientPlan> {
    return this.ccps.createPatientPlan(dto);
  }
  @Query(() => [PatientPlan])
  async getPatientPlans(
    @Args('input') dto: GetPatientPlansDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<PatientPlan[]> {
    const patientGroup = await this.cpps.getPatientPlans(dto, selectors);
    return patientGroup;
  }
  @Mutation(() => PatientPlan)
  async duplicatePatientPlan(
    @Args('input') dto: DuplicatePatientPlanDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>
  ): Promise<PatientPlan> {
    return await this.dcps.duplicatePatientPlan(dto, selectors);
  }
  @Mutation(() => PatientPlan)
  async updatePatientPlan(
    @Args('input') dto: UpdatePatientPlanDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<PatientPlan> {
    return this.cpps.updatePatientPlan(dto, selectors);
  }

  @Mutation(() => PatientPlan)
  deletePatientPlan(
    @Args('input') dto: DeletePatientPlanDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<PatientPlan> {
    return this.cpps.deletePatientPlan(dto, selectors);
  }
}
