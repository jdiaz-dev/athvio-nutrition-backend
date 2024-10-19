import { UseGuards } from '@nestjs/common';
import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { GetDataPatientDto } from 'src/modules/patients/patients/adapters/in/mobile/dtos/get-patient.dto copy';
import { GetPatientsService } from 'src/modules/patients/patients/application/get-patient.service';

@Resolver(() => Patient)
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class PatientsMobileResolver {
  constructor(private readonly gps: GetPatientsService) {}

  @Query(() => Patient)
  async getPatient(
    @Args('patient') dto: GetDataPatientDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<Patient> {
    const patient = await this.gps.getPatientForMobile(dto.patient, selectors);
    return patient;
  }
}
