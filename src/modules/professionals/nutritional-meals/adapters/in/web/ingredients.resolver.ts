// import { FieldMap } from '@jenyus-org/nestjs-graphql-utils';
import { UseGuards } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { NutritionalMeal } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { IngredientDetail } from 'src/shared/schemas/meal-plan';

@Resolver(() => NutritionalMeal)
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class IngredientsResolver {
  //resolving object array
  @ResolveField(() => [IngredientDetail], { name: 'ingredients' })
  getProductProviders(@Parent() customMeal: NutritionalMeal): IngredientDetail[] {
    return customMeal.ingredientDetails;
  }
}
