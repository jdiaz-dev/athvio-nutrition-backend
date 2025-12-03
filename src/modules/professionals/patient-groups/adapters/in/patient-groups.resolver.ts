import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePatientGroupDto } from 'src/modules/professionals/patient-groups/adapters/in/dtos/create-patient-group.dto';
import { DeletePatientGroupDto } from 'src/modules/professionals/patient-groups/adapters/in/dtos/delete-patient-group.dto';
import { GetPatientGroupsDto } from 'src/modules/professionals/patient-groups/adapters/in/dtos/get-patient-groups.dto';
import { UpdatePatientGroupDto } from 'src/modules/professionals/patient-groups/adapters/in/dtos/update-patient-group.dto';
import { PatientGroup } from 'src/modules/professionals/patient-groups/adapters/out/patient-group.schema';
import { PatientGroupsManagementService } from 'src/modules/professionals/patient-groups/application/patient-groups-management.service';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/adapters/in/guards/authorization-professional.guard';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class PatientGroupsResolver {
  constructor(private cgms: PatientGroupsManagementService) {}

  @Mutation(() => PatientGroup)
  @UseGuards(AuthorizationGuard)
  createPatientGroup(@Args('input') dto: CreatePatientGroupDto): Promise<PatientGroup> {
    return this.cgms.createPatientGroup(dto);
  }

  @Query(() => [PatientGroup])
  @UseGuards(AuthorizationGuard)
  async getPatientGroups(@Args('input') dto: GetPatientGroupsDto): Promise<PatientGroup[]> {
    const patientGroup = await this.cgms.getPatientGroups(dto);
    return patientGroup;
  }

  @Mutation(() => PatientGroup)
  @UseGuards(AuthorizationGuard)
  async updatePatientGroup(@Args('input') dto: UpdatePatientGroupDto): Promise<PatientGroup> {
    return this.cgms.updatePatientGroup(dto);
  }

  @Mutation(() => PatientGroup)
  @UseGuards(AuthorizationGuard)
  deletePatientGroup(@Args('input') dto: DeletePatientGroupDto): Promise<PatientGroup> {
    return this.cgms.deletePatientGroup(dto);
  }
}
