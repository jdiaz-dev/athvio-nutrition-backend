import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePatientPlanDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/plan/create-patient-plan.dto';
import { DeletePatientPlanDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/plan/delete-patient-plan.dto';
import { DuplicatePatientPlanDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/plan/duplicate-patient-plan.dto';
import { GetPatientPlansForWebDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/plan/get-patient-plans-for-web.dto';
import { UpdatePatientPlanDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/plan/update-patient-plan.dto';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { PatientPlansPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plans-persistence.service';
import { CreatePatientPlanManagerService } from 'src/modules/patients/patient-plans/application/create-patient-plan-manager.service';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/adapters/in/guards/authorization-professional.guard';
import { selectorExtractor, selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { DuplicatePatientPlanService } from 'src/modules/patients/patient-plans/application/duplicate-patient-plan.service';
import { GetPatientPlansManagerService } from 'src/modules/patients/patient-plans/application/get-patient-plans-manager.service';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class PatientPlansWebResolver {
  constructor(
    private readonly cpps: PatientPlansPersistenceService,
    private readonly ccps: CreatePatientPlanManagerService,
    private readonly dcps: DuplicatePatientPlanService,
    private readonly gppms: GetPatientPlansManagerService,
  ) {}

  @Mutation(() => PatientPlan)
  createPatientPlan(@Args('input') dto: CreatePatientPlanDto): Promise<PatientPlan> {
    return this.ccps.createPatientPlan(dto);
  }
  @Query(() => [PatientPlan])
  async getPatientPlansForWeb(
    @Args('patientPlans') dto: GetPatientPlansForWebDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<PatientPlan[]> {
    const patientPlans = await this.gppms.getPatientPlansForWeb(dto, selectors);
    return patientPlans;
  }
  @Mutation(() => PatientPlan)
  async duplicatePatientPlan(
    @Args('input') dto: DuplicatePatientPlanDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<PatientPlan> {
    return await this.dcps.duplicatePatientPlan(dto, selectors);
  }
  @Mutation(() => PatientPlan)
  async updatePatientPlan(
    @Args('input') dto: UpdatePatientPlanDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
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
