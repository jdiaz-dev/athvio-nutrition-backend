import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { AddClientPlanCommentDto } from 'src/modules/clients/client-plans/adapters/in/dtos/client-plan-comment/add-client-plan-comment.dto copy';
import { DeleteClientPlanCommentDto } from 'src/modules/clients/client-plans/adapters/in/dtos/client-plan-comment/delete-client-plan-comment.dto';
import { UpdateClientPlanCommentDto } from 'src/modules/clients/client-plans/adapters/in/dtos/client-plan-comment/update-client-plan-comment.dto';
import { ClientPlanCommentPersistenceService } from 'src/modules/clients/client-plans/adapters/out/client-plan-comment-persistence.service';
import { ClientPlan } from 'src/modules/clients/client-plans/adapters/out/client-plan.schema';
import { AddClientPlanCommentService } from 'src/modules/clients/client-plans/application/add-client-plan-comment.service';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { selectorExtractor } from 'src/shared/helpers/graphql-helpers';

@Resolver()
export class ClientPlanCommentsResolver {
  constructor(private cpcps: ClientPlanCommentPersistenceService, private acpcs: AddClientPlanCommentService) {}

  @Mutation(() => ClientPlan)
  @UseGuards(AuthorizationGuard)
  addClientPlanComment(
    @Args('input') dto: AddClientPlanCommentDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<ClientPlan> {
    return this.acpcs.addClientPlanComment(dto, selectors);
  }

  @Mutation(() => ClientPlan)
  @UseGuards(AuthorizationGuard)
  async updateClientPlanComment(
    @Args('input') dto: UpdateClientPlanCommentDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<ClientPlan> {
    return this.cpcps.updateClientPlanComment(dto, selectors);
  }

  @Mutation(() => ClientPlan)
  @UseGuards(AuthorizationGuard)
  async deleteClientPlanComment(
    @Args('input') dto: DeleteClientPlanCommentDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<ClientPlan> {
    return this.cpcps.deleteClientPlanComment(dto, selectors);
  }
}
