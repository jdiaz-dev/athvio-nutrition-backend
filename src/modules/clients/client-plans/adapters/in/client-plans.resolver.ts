import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateClientPlanDto } from 'src/modules/clients/client-plans/adapters/in/dtos/client-plan/create-client-plan.dto';
import { DeleteClientPlanDto } from 'src/modules/clients/client-plans/adapters/in/dtos/client-plan/delete-client-plan.dto';
import { GetClientPlansDto } from 'src/modules/clients/client-plans/adapters/in/dtos/client-plan/get-client-plans.dto';
import { UpdateClientPlanDateDto } from 'src/modules/clients/client-plans/adapters/in/dtos/client-plan/update-client-plan-date.dto';
import { UpdateClientPlanDto } from 'src/modules/clients/client-plans/adapters/in/dtos/client-plan/update-client-plan.dto';
import { ClientPlan } from 'src/modules/clients/client-plans/adapters/out/client-plan.schema';
import { ClientPlansPersistenceService } from 'src/modules/clients/client-plans/adapters/out/client-plans-persistence.service';
import { CreateClientPlanService } from 'src/modules/clients/client-plans/application/create-client-plan.service';
import { AuthorizationGuard } from 'src/modules/security/adapters/in/guards/authorization.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { selectorExtractor } from 'src/shared/helpers/functions';
import { IUserContext } from 'src/shared/interfaces/user-context';

@Resolver()
export class ClientPlansResolver {
  constructor(private readonly cpps: ClientPlansPersistenceService, private ccps: CreateClientPlanService) {}

  @Mutation(() => ClientPlan)
  @UseGuards(AuthorizationGuard)
  createClientPlan(@Args('input') dto: CreateClientPlanDto, @CurrentUser() context: IUserContext): Promise<ClientPlan> {
    return this.ccps.createClientPlan(dto, context.userId);
  }

  @Query(() => [ClientPlan])
  @UseGuards(AuthorizationGuard)
  async getClientPlans(
    @Args('input') dto: GetClientPlansDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<ClientPlan[]> {
    const clientGroup = await this.cpps.getClientPlans(dto, selectors);
    return clientGroup;
  }

  @Mutation(() => ClientPlan)
  @UseGuards(AuthorizationGuard)
  async updateClientPlan(
    @Args('input') dto: UpdateClientPlanDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<ClientPlan> {
    return this.cpps.updateClientPlan(dto, selectors);
  }

  @Mutation(() => ClientPlan)
  @UseGuards(AuthorizationGuard)
  async updateClientPlanDate(
    @Args('input') dto: UpdateClientPlanDateDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<ClientPlan> {
    return this.cpps.updateClientPlan(dto, selectors);
  }

  @Mutation(() => ClientPlan)
  @UseGuards(AuthorizationGuard)
  deleteClientPlan(
    @Args('input') dto: DeleteClientPlanDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<ClientPlan> {
    return this.cpps.deleteClientPlan(dto, selectors);
  }
}
