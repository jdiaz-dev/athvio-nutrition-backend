import { UseGuards } from '@nestjs/common';
import { Args, Info, Query, Resolver } from '@nestjs/graphql';

import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { AuthorizationPatientGuard } from 'src/shared/guards/authorization-patient.guard';
import { GetPatientPlansForMobileDto } from 'src/modules/patients/patient-plans/adapters/in/mobile/dtos/get-patient-plans-for-mobile.dto';
import { GetPatientPlansManagerService } from 'src/modules/patients/patient-plans/application/get-patient-plans-manager.service';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationPatientGuard])
export class PatientPlansMobileResolver {
  constructor(private readonly gppms: GetPatientPlansManagerService) {}

  @Query(() => [PatientPlan])
  async getPatientPlansForMobile(
    @Args('patientPlans') dto: GetPatientPlansForMobileDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<PatientPlan[]> {
    const patientPlans = await this.gppms.getPatientPlansForMobile(dto, selectors);
    return patientPlans;
  }
}
