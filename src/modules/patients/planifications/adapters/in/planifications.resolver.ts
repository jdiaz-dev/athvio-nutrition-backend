import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePlanificationDto } from 'src/modules/patients/planifications/adapters/in/dtos/create-planification.dto';
import { Planification } from 'src/modules/patients/planifications/adapters/out/planification.schema';
import { GetPlanificationDto } from 'src/modules/patients/planifications/adapters/in/dtos/get-calory.dto';
import { updatePlanificationDto } from 'src/modules/patients/planifications/adapters/in/dtos/update-calory.dto';
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

  @Query(() => Planification)
  async getPlanification(
    @Args('input') dto: GetPlanificationDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<Planification> {
    return await this.ccs.getPlanification(dto, selectors);
  }
  @Query(() => [Planification])
  async getPlanifications(
    @Args('input') dto: GetPlanificationDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<Planification[]> {
    return await this.ccs.getPlanifications(dto, selectors);
  }

  @Mutation(() => Planification)
  async updatePlanification(
    @Args('input') dto: updatePlanificationDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Planification> {
    return this.ccs.updatePlanification(dto, selectors);
  }
}
