import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { selectorExtractor, selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { PatientProgramsManagerService } from 'src/modules/patients/patient-programs/application/patient-programs-manager.service';
import {
  GetPatientProgramsDto,
  GetPatientProgramsResponse,
} from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program/get-patient-programs.dto';
import { CreatePatientProgramDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program/create-patient-program.dto';
import { PatientProgram } from 'src/modules/patients/patient-programs/adapters/out/patient-program.schema';
import { UpdatePatientProgramDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program/update-patient-program.dto';
import { DeletePatientProgramDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program/delete-program.dto';

@Resolver()
@UseGuards(...[AuthorizationGuard])
export class PatientProgramsResolver {
  constructor(private readonly ppms: PatientProgramsManagerService) {}
  @Mutation(() => PatientProgram)
  createPatientProgram(@Args('input') dto: CreatePatientProgramDto): Promise<PatientProgram> {
    return this.ppms.createPatientProgram(dto);
  }
  @Query(() => GetPatientProgramsResponse)
  async getPatientPrograms(
    @Args('input') dto: GetPatientProgramsDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<GetPatientProgramsResponse> {
    const program = await this.ppms.getPatientPrograms(dto, selectors);
    return program;
  }
  @Mutation(() => PatientProgram)
  async updatePatientProgram(@Args('input') dto: UpdatePatientProgramDto): Promise<PatientProgram> {
    return this.ppms.updatePatientProgram(dto);
  }
  @Mutation(() => PatientProgram)
  async deletePatientProgram(
    @Args('input') dto: DeletePatientProgramDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<PatientProgram> {
    return this.ppms.deletePatientProgram(dto, selectors);
  }
}
