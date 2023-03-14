// import { FieldMap } from '@jenyus-org/nestjs-graphql-utils';
import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateCustomMealDto } from 'src/modules/professionals/custom-meals/adapters/in/dtos/create-custom-meal.dto';
import { DeleteCustomMealDto } from 'src/modules/professionals/custom-meals/adapters/in/dtos/delete-custom-meal.dto';
import { GetCustomMealDto } from 'src/modules/professionals/custom-meals/adapters/in/dtos/get-custom-meal.dto';
import { GetCustomMealsDto } from 'src/modules/professionals/custom-meals/adapters/in/dtos/get-custom-meals.dto';
import { UpdateCustomMealDto } from 'src/modules/professionals/custom-meals/adapters/in/dtos/update-custom-meal.dto';
import { CustomMeal } from 'src/modules/professionals/custom-meals/adapters/out/custom-meal.schema';
import { CustomMealsPersistenceService } from 'src/modules/professionals/custom-meals/adapters/out/custom-meals-persistence.service';
import { CustomMealsManagementService } from 'src/modules/professionals/custom-meals/application/custom-meals-management.service';
import { AuthorizationGuard } from 'src/modules/security/security/adapters/in/guards/authorization.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractor } from 'src/shared/helpers/functions';
import { IUserContext } from 'src/shared/interfaces/user-context';

@Resolver(() => CustomMeal)
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class CustomMealsResolver {
  constructor(private readonly cmps: CustomMealsPersistenceService, private cmms: CustomMealsManagementService) {}

  @Mutation(() => CustomMeal)
  createCustomMeal(@Args('input') dto: CreateCustomMealDto): Promise<CustomMeal> {
    return this.cmms.createCustomMeal(dto);
  }

  @Query(() => CustomMeal)
  async getCustomMeal(
    @Args('input') dto: GetCustomMealDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<CustomMeal> {
    const customMeal = await this.cmps.getCustomMeal(dto, selectors);
    return customMeal;
  }

  @Query(() => [CustomMeal])
  async getCustomMeals(
    @Args('input') dto: GetCustomMealsDto,
    @Info(...selectorExtractor()) selectors: any,
  ): Promise<CustomMeal[]> {
    const customMeal = await this.cmps.getCustomMeals(dto, selectors);
    return customMeal;
  }

  @Mutation(() => CustomMeal)
  async updateCustomMeal(@Args('input') dto: UpdateCustomMealDto): Promise<CustomMeal> {
    return this.cmps.updateCustomMeal(dto);
  }

  @Mutation(() => CustomMeal)
  deleteCustomMeal(@Args('input') dto: DeleteCustomMealDto, @CurrentUser() context: IUserContext): Promise<CustomMeal> {
    return this.cmps.deleteCustomMeal(dto, context.professionalId);
  }
}
