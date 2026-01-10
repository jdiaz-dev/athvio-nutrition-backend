import { UseGuards } from '@nestjs/common';
import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import { Program } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { PatientProgramsManagerService } from 'src/modules/patients/patient-programs/application/patient-programs-manager.service';
import {
  GetPatientProgramsDto,
  GetPatientProgramsResponse,
} from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program/get-patient-programs.dto';

@Resolver()
@UseGuards(...[AuthorizationGuard])
export class PatientProgramsResolver {
  constructor(private readonly ppms: PatientProgramsManagerService) {}

  @Query(() => Program)
  async getPatientPrograms(
    @Args('input') dto: GetPatientProgramsDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<GetPatientProgramsResponse> {
    const program = await this.ppms.getPatientPrograms(dto, selectors);
    return program;
  }
}
