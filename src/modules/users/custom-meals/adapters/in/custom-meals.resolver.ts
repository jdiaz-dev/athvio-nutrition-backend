// import { FieldMap } from '@jenyus-org/nestjs-graphql-utils';
import { UseGuards } from '@nestjs/common';
import { Args, Context, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/security/adapters/in/guards/authorization.guard';
import { CreateCustomMealDto } from 'src/modules/users/custom-meals/adapters/in/dtos/create-custom-meal.dto';
import { DeleteCustomMealDto } from 'src/modules/users/custom-meals/adapters/in/dtos/delete-custom-meal.dto';
import { GetCustomMealDto } from 'src/modules/users/custom-meals/adapters/in/dtos/get-custom-meal.dto';
import { GetCustomMealsDto } from 'src/modules/users/custom-meals/adapters/in/dtos/get-custom-meals.dto';
import { UpdateCustomMealDto } from 'src/modules/users/custom-meals/adapters/in/dtos/update-custom-meal.dto';
import { CustomMeal } from 'src/modules/users/custom-meals/adapters/out/custom-meal.schema';
import { CustomMealsPersistenceService } from 'src/modules/users/custom-meals/adapters/out/custom-meals-persistence.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { selectorExtractor } from 'src/shared/helpers/functions';
import { IUserContext } from 'src/shared/interfaces/user-context';

@Resolver(() => CustomMeal)
export class CustomMealsResolver {
  constructor(private readonly cmps: CustomMealsPersistenceService) {}

  @Mutation(() => CustomMeal)
  @UseGuards(AuthorizationGuard)
  createCustomMeal(@Args('input') dto: CreateCustomMealDto, @Context() context: any): Promise<CustomMeal> {
    return this.cmps.createCustomMeal(dto, context.req.user.userId);
  }

  @Query(() => CustomMeal)
  @UseGuards(AuthorizationGuard)
  async getCustomMeal(
    @Args('input') dto: GetCustomMealDto,
    @CurrentUser() context: IUserContext,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<CustomMeal> {

    const customMeal = await this.cmps.getCustomMeal(dto, context.userId, selectors);
    return customMeal;
  }

  @Query(() => [CustomMeal])
  @UseGuards(AuthorizationGuard)
  async getCustomMeals(
    @Args('input') dto: GetCustomMealsDto,
    @CurrentUser() context: IUserContext,
    @Info(...selectorExtractor()) selectors: any,
  ): Promise<CustomMeal[]> {
    const customMeal = await this.cmps.getCustomMeals(dto, context.userId, selectors);
    return customMeal;
  }

  @Mutation(() => CustomMeal)
  @UseGuards(AuthorizationGuard)
  async updateCustomMeal(
    @Args('input') dto: UpdateCustomMealDto,
    @CurrentUser() context: IUserContext,
  ): Promise<CustomMeal> {
    return this.cmps.updateCustomMeal(dto, context.userId);
  }

  @Mutation(() => CustomMeal)
  @UseGuards(AuthorizationGuard)
  deleteCustomMeal(@Args('input') dto: DeleteCustomMealDto, @CurrentUser() context: IUserContext): Promise<CustomMeal> {
    return this.cmps.deleteCustomMeal(dto, context.userId);
  }
}
