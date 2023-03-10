import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/security/adapters/in/guards/authorization.guard';
import { AddPlanMealDto } from 'src/modules/users/programs/adapters/in/dtos/meal/add-plan-meal.dto';
import { DeletePlanMealDto } from 'src/modules/users/programs/adapters/in/dtos/meal/delete-plan-meal.dto';
import { UpdateMealDto } from 'src/modules/users/programs/adapters/in/dtos/meal/update-meal.dto';
import { MealsPersistenceService } from 'src/modules/users/programs/adapters/out/meals-persistence.service';
import { Program } from 'src/modules/users/programs/adapters/out/program.schema';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { selectorExtractor } from 'src/shared/helpers/functions';
import { IUserContext } from 'src/shared/interfaces/user-context';

@Resolver()
export class MealsResolver {
  constructor(private readonly mps: MealsPersistenceService) {}

  @Mutation(() => Program)
  @UseGuards(AuthorizationGuard)
  createPlanMeal(
    @Args('input') dto: AddPlanMealDto,
    @CurrentUser() context: IUserContext,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.mps.addPlanMeal(dto, context.userId, selectors);
  }

  @Mutation(() => Program)
  @UseGuards(AuthorizationGuard)
  async updatePlanMeal(
    @Args('input') dto: UpdateMealDto,
    @CurrentUser() context: IUserContext,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.mps.updatePlanMeal(dto, context.userId, selectors);
  }

  @Mutation(() => Program)
  @UseGuards(AuthorizationGuard)
  async deletePlanMeal(
    @Args('input') dto: DeletePlanMealDto,
    @CurrentUser() context: IUserContext,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.mps.deletePlanMeal(dto, context.userId, selectors);
  }
}
