import { UseGuards } from '@nestjs/common';
import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import {
  GetPatientForMobileDto,
  GetPatientForMobileResponse,
} from 'src/modules/patients/patients/adapters/in/mobile/dtos/get-patient.dto copy';
import { GetPatientManagerService } from 'src/modules/patients/patients/application/get-patient-manager.service';
import { AuthorizationPatientGuard } from 'src/shared/guards/authorization-patient.guard';

@Resolver(() => Patient)
@UseGuards(...[AuthorizationGuard, AuthorizationPatientGuard])
export class PatientsMobileResolver {
  constructor(private readonly gps: GetPatientManagerService) {}

  @Query(() => GetPatientForMobileResponse)
  async getPatientForMobile(
    @Args('input') dto: GetPatientForMobileDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<GetPatientForMobileResponse> {
    const patient = await this.gps.getPatientForMobile(dto.patient, selectors);
    return patient;
  }
}
