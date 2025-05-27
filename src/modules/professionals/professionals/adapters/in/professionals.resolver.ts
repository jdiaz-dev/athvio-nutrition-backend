import { UseGuards } from '@nestjs/common';
import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { GetProfessionalDto } from 'src/modules/professionals/professionals/adapters/in/dtos/get-professional.dt';
import { Professional } from 'src/modules/professionals/professionals/adapters/out/professional.schema';
import { ProfessionalUser } from 'src/modules/professionals/professionals/adapters/out/professional.types';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';

//TODO : delete it, think how to udpate professional
@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class ProfessionalsResolver {
  constructor(private pms: ProfessionalsManagementService) {}

  @Query(() => Professional)
  getProfessional(
    @Args('professional') dto: GetProfessionalDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<ProfessionalUser> {
    return this.pms.getProfessionalById(dto.professional, selectors);
  }
}
