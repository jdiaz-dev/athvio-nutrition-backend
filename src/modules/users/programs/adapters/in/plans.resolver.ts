import { UseGuards } from '@nestjs/common';
import { Args, Context, Info, Mutation, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/security/adapters/in/guards/authorization.guard';
import { AddPlanDto } from 'src/modules/users/programs/adapters/in/dtos/plan/add-plan.dto';
import { DeletePlanDto } from 'src/modules/users/programs/adapters/in/dtos/plan/delete-plan.dto';
import { UpdatePlanDto } from 'src/modules/users/programs/adapters/in/dtos/plan/update-plan.dto';
import { PlansPersistenceService } from 'src/modules/users/programs/adapters/out/plans-persistence.service';

import { Program } from 'src/modules/users/programs/adapters/out/program.schema';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { selectorExtractor } from 'src/shared/helpers/functions';
import { IUserContext } from 'src/shared/interfaces/user-context';

@Resolver()
export class PlansResolver {
  constructor(private readonly pps: PlansPersistenceService) {}

  @Mutation(() => Program)
  @UseGuards(AuthorizationGuard)
  addProgramPlan(
    @Args('input') dto: AddPlanDto,
    @Context() context: any,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.pps.addProgramPlan(dto, context.req.user.userId, selectors);
  }

  @Mutation(() => Program)
  @UseGuards(AuthorizationGuard)
  async updateProgramPlan(
    @Args('input') dto: UpdatePlanDto,
    @CurrentUser() context: IUserContext,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.pps.updateProgramPlan(dto, context.userId, selectors);
  }
  @Mutation(() => Program)
  @UseGuards(AuthorizationGuard)
  async deleteProgramPlan(
    @Args('input') dto: DeletePlanDto,
    @CurrentUser() context: IUserContext,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.pps.deleteProgramPlan(dto, context.userId, selectors);
  }
}
