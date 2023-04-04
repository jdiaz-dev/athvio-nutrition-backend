// import { FieldMap } from '@jenyus-org/nestjs-graphql-utils';
import { UseGuards } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { CustomRecipe } from 'src/modules/professionals/custom-recipes/adapters/out/custom-recipe.schema';
import { AuthorizationGuard } from 'src/modules/security/security/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { Ingredient } from 'src/shared/models/ingredient';

@Resolver(() => CustomRecipe)
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class IngredientsResolver {
  //resolving object array
  @ResolveField('ingredients', () => [Ingredient])
  getProductProviders(@Parent() customMeal: CustomRecipe): Ingredient[] {
    return customMeal.ingredients;
  }
}
