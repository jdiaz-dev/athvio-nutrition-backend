import { UseGuards } from '@nestjs/common';
import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { PatientsPersistenceService } from 'src/modules/patients/patients/adapters/out/patients-persistence.service';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractor } from 'src/shared/helpers/graphql-helpers';
import { GetDataPatientDto } from 'src/modules/patients/patients/adapters/in/mobile/dtos/get-patient.dto copy';

@Resolver(() => Patient)
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class PatientsMobileResolver {
  constructor(private readonly cps: PatientsPersistenceService) {}

  @Query(() => Patient)
  async getPatient(@Args('patient') dto: GetDataPatientDto, @Info(...selectorExtractor()) selectors: string[]): Promise<Patient> {
    selectors
    const patient = await this.cps.getPatientById(dto.patient);
    return patient;
  }
}
