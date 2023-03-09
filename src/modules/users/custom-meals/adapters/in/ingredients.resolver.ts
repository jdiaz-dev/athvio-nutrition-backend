// import { FieldMap } from '@jenyus-org/nestjs-graphql-utils';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { CustomMeal } from 'src/modules/users/custom-meals/adapters/out/custom-meal.schema';
import { Ingredient } from 'src/shared/models/ingredients';

@Resolver(() => CustomMeal)
export class IngredientsResolver {

  //resolving object array
  @ResolveField('ingredients', () => [Ingredient])
  getProductProviders(@Parent() customMeal: CustomMeal): Ingredient[] {
    return customMeal.ingredients;
  }
}
