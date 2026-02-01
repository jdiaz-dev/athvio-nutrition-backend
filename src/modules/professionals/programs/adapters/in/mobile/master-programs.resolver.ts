import { UseGuards } from '@nestjs/common';
import { Args, Info, Query, Resolver } from '@nestjs/graphql';

import {
  GetProgramsDto,
  GetProgramsResponse,
} from 'src/modules/professionals/programs/adapters/in/web/dtos/program/get-programs.dto';

import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { MasterProgramsManagerService } from 'src/modules/professionals/programs/application/master-programs-manager.service';
import { AuthorizationPatientGuard } from 'src/shared/adapters/in/guards/authorization-patient.guard';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationPatientGuard])
export class MasterProgramsResolver {
  constructor(private readonly prms: MasterProgramsManagerService) {}

  @Query(() => GetProgramsResponse)
  async getMasterPrograms(
    @Args('input') dto: GetProgramsDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<GetProgramsResponse> {
    return await this.prms.getMasterPrograms(dto, selectors);
  }
}
