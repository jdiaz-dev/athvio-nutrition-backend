import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateClientPlanDto } from 'src/modules/clients/client-plans/adapters/in/dtos/plan/create-client-plan.dto';
import { DeleteClientPlanDto } from 'src/modules/clients/client-plans/adapters/in/dtos/plan/delete-client-plan.dto';
import { DuplicateClientPlanDto } from 'src/modules/clients/client-plans/adapters/in/dtos/plan/duplicate-client-plan.dto';
import { GetClientPlansDto } from 'src/modules/clients/client-plans/adapters/in/dtos/plan/get-client-plans.dto';
import { UpdateClientPlanDto } from 'src/modules/clients/client-plans/adapters/in/dtos/plan/update-client-plan.dto';
import { ClientPlan } from 'src/modules/clients/client-plans/adapters/out/client-plan.schema';
import { ClientPlansPersistenceService } from 'src/modules/clients/client-plans/adapters/out/client-plans-persistence.service';
import { CreateClientPlanService } from 'src/modules/clients/client-plans/application/create-client-plan.service';
import { DuplicateClientPlanService } from 'src/modules/clients/client-plans/application/duplicate-client-plan.service';
import { AuthorizationGuard } from 'src/modules/security/security/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractor, selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class ClientPlansResolver {
  constructor(
    private readonly cpps: ClientPlansPersistenceService,
    private ccps: CreateClientPlanService,
    private dcps: DuplicateClientPlanService) {}

  @Mutation(() => ClientPlan)
  createClientPlan(@Args('input') dto: CreateClientPlanDto): Promise<ClientPlan> {
    return this.ccps.createClientPlan(dto);
  }
  @Query(() => [ClientPlan])
  async getClientPlans(
    @Args('input') dto: GetClientPlansDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<ClientPlan[]> {
    const clientGroup = await this.cpps.getClientPlans(dto, selectors);
    return clientGroup;
  }
  @Mutation(() => ClientPlan)
  async duplicateClientPlan(
    @Args('input') dto: DuplicateClientPlanDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>
  ): Promise<ClientPlan> {
    return await this.dcps.duplicateClientPlan(dto, selectors);
  }
  @Mutation(() => ClientPlan)
  async updateClientPlan(
    @Args('input') dto: UpdateClientPlanDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<ClientPlan> {
    return this.cpps.updateClientPlan(dto, selectors);
  }

  @Mutation(() => ClientPlan)
  deleteClientPlan(
    @Args('input') dto: DeleteClientPlanDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<ClientPlan> {
    return this.cpps.deleteClientPlan(dto, selectors);
  }
}
