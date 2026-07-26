import { UseGuards } from '@nestjs/common';
import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import {
  GetPatientForMobileDto,
  GetPatientForMobileResponse,
} from 'src/modules/patients/patients/adapters/in/mobile/dtos/get-patient-for-mobile.dto';
import { AuthorizationPatientGuard } from 'src/shared/adapters/in/guards/authorization-patient.guard';
import { GetPatientForMobileService } from 'src/modules/patients/patients/application/get-patient-for-mobile.service';

@Resolver(() => Patient)
@UseGuards(...[AuthorizationGuard, AuthorizationPatientGuard])
export class PatientsMobileResolver {
  constructor(private readonly gpfms: GetPatientForMobileService) {}

  @Query(() => GetPatientForMobileResponse)
  async getPatientForMobile(
    @Args('input') dto: GetPatientForMobileDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<GetPatientForMobileResponse> {
    const patient = await this.gpfms.getPatientForMobile(dto.patient, selectors);
    return patient;
  }
}
