import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePlanificationDto } from 'src/modules/patients/planifications/adapters/in/dtos/create-planification.dto';
import { Planification } from 'src/modules/patients/planifications/adapters/out/planification.schema';
import { GetPlanificationsDto } from 'src/modules/patients/planifications/adapters/in/dtos/get-planifications.dto';
import { UpdatePlanificationDto } from 'src/modules/patients/planifications/adapters/in/dtos/update-planification.dto';
import { PlanificationManagerService } from 'src/modules/patients/planifications/application/planification-manager.service';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractor, selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';

@Resolver(() => Planification)
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class PlanificationResolver {
  constructor(private ccs: PlanificationManagerService) {}

  @Mutation(() => Planification)
  createPlanification(@Args('input') dto: CreatePlanificationDto): Promise<Planification> {
    return this.ccs.createPlanification(dto);
  }

  @Query(() => [Planification])
  async getPlanifications(
    @Args('input') dto: GetPlanificationsDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<Planification[]> {
    return await this.ccs.getPlanifications(dto, selectors);
  }

  @Mutation(() => Planification)
  async updatePlanification(
    @Args('input') dto: UpdatePlanificationDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Planification> {
    return this.ccs.updatePlanification(dto, selectors);
  }
}
