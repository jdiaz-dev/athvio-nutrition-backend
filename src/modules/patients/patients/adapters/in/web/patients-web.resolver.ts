import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetPatientsDto, GetPatientsResponse } from 'src/modules/patients/patients/adapters/in/web/dtos/get-patients.dto';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { PatientsPersistenceService } from 'src/modules/patients/patients/adapters/out/patients-persistence.service';
import { ManagePatientGroupDto } from 'src/modules/patients/patients/adapters/in/web/dtos/manage-patient-group.dto';
import { ManagePatientGroupService } from 'src/modules/patients/patients/application/manage-patient-group.service';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractor, selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { ManagePatientStateDto } from 'src/modules/patients/patients/adapters/in/web/dtos/manage-patient-state.dto';
import { GetPatientDto } from 'src/modules/patients/patients/adapters/in/web/dtos/get-patient.dto';

@Resolver(() => Patient)
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class PatientsWebResolver {
  constructor(private readonly cps: PatientsPersistenceService, private mcgs: ManagePatientGroupService) {}

  @Query(() => Patient)
  async getPatient(
    @Args('patient') dto: GetPatientDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<Patient> {
    const patient = await this.cps.getPatient(dto.professional, dto.patient, selectors);
    return patient;
  }
  
  @Query(() => GetPatientsResponse)
  async getPatients(
    @Args('input') dto: GetPatientsDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<GetPatientsResponse> {
    const patientGroup = await this.cps.getPatients(dto, selectors);
    return patientGroup;
  }

  @Mutation(() => Patient)
  managePatientGroup(@Args('input') dto: ManagePatientGroupDto): Promise<Patient> {
    return this.mcgs.managePatientGroup(dto);
  }

  @Mutation(() => Patient)
  managePatientState(
    @Args('input') dto: ManagePatientStateDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Patient> {
    return this.cps.managePatientState(dto, selectors);
  }
}
