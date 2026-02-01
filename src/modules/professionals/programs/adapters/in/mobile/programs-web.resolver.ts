import { UseGuards } from '@nestjs/common';
import { Args, Info, Query, Resolver } from '@nestjs/graphql';

import {
  GetProgramsDto,
  GetProgramsResponse,
} from 'src/modules/professionals/programs/adapters/in/web/dtos/program/get-programs.dto';

import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/adapters/in/guards/authorization-professional.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { MasterProgramsManagerService } from 'src/modules/professionals/programs/application/master-programs-manager.service';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
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
