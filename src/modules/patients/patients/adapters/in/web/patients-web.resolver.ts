import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetPatientsDto, GetPatientsResponse } from 'src/modules/patients/patients/adapters/in/web/dtos/get-patients.dto';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { ManagePatientGroupDto } from 'src/modules/patients/patients/adapters/in/web/dtos/manage-patient-group.dto';
import { ManagePatientGroupService } from 'src/modules/patients/patients/application/manage-patient-group.service';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractor, selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { ManagePatientStateDto } from 'src/modules/patients/patients/adapters/in/web/dtos/manage-patient-state.dto';
import { GetPatientForWebDto } from 'src/modules/patients/patients/adapters/in/web/dtos/get-patient.dto';
import { GetPatientsService } from 'src/modules/patients/patients/application/get-patient.service';
import { PatientManagementService } from 'src/modules/patients/patients/application/patient-management.service';

@Resolver(() => Patient)
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class PatientsWebResolver {
  constructor(
    private readonly gps: GetPatientsService,
    private readonly mcgs: ManagePatientGroupService,
    private readonly pms: PatientManagementService,
  ) {}

  @Query(() => Patient)
  async getPatientForWeb(
    @Args('patient') dto: GetPatientForWebDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<Patient> {
    const patient = await this.gps.getPatient(dto.patient, dto.professional, selectors);
    return patient;
  }

  @Query(() => GetPatientsResponse)
  async getPatients(
    @Args('input') dto: GetPatientsDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<GetPatientsResponse> {
    const patientGroup = await this.gps.getPatients(dto, selectors);
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
    return this.pms.managePatientState(dto, selectors);
  }
}
