// import { FieldMap } from '@jenyus-org/nestjs-graphql-utils';
import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateCustomRecipeDto } from 'src/modules/professionals/custom-recipes/adapters/in/dtos/create-custom-recipe.dto';
import { DeleteCustomRecipeDto } from 'src/modules/professionals/custom-recipes/adapters/in/dtos/delete-custom-recipe.dto';
import { GetCustomRecipeDto } from 'src/modules/professionals/custom-recipes/adapters/in/dtos/get-custom-recipe.dto';
import {
  GetCustomRecipesDto,
  GetCustomRecipesResponse,
} from 'src/modules/professionals/custom-recipes/adapters/in/dtos/get-custom-recipes.dto';
import { UpdateCustomRecipeDto } from 'src/modules/professionals/custom-recipes/adapters/in/dtos/update-custom-recipe.dto';
import { CustomRecipe } from 'src/modules/professionals/custom-recipes/adapters/out/custom-recipe.schema';
import { CustomRecipesPersistenceService } from 'src/modules/professionals/custom-recipes/adapters/out/custom-recipes-persistence.service';
import { CustomRecipesManagementService } from 'src/modules/professionals/custom-recipes/application/custom-recipes-management.service';
import { AuthorizationGuard } from 'src/modules/security/security/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractor, selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';

@Resolver(() => CustomRecipe)
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class CustomRecipesResolver {
  constructor(private readonly crps: CustomRecipesPersistenceService, private crms: CustomRecipesManagementService) {}

  @Mutation(() => CustomRecipe)
  createCustomRecipe(@Args('input') dto: CreateCustomRecipeDto): Promise<CustomRecipe> {
    return this.crms.createCustomRecipe(dto);
  }

  @Query(() => CustomRecipe)
  async getCustomRecipe(
    @Args('input') dto: GetCustomRecipeDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<CustomRecipe> {
    const customRecipe = await this.crps.getCustomRecipe(dto, selectors);
    return customRecipe;
  }

  @Query(() => GetCustomRecipesResponse)
  async getCustomRecipes(
    @Args('input') dto: GetCustomRecipesDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<GetCustomRecipesResponse> {
    const customRecipe = await this.crps.getCustomRecipes(dto, selectors);
    return customRecipe;
  }

  @Mutation(() => CustomRecipe)
  async updateCustomRecipe(@Args('input') dto: UpdateCustomRecipeDto): Promise<CustomRecipe> {
    return this.crps.updateCustomRecipe(dto);
  }

  @Mutation(() => CustomRecipe)
  deleteCustomRecipe(@Args('input') dto: DeleteCustomRecipeDto): Promise<CustomRecipe> {
    return this.crps.deleteCustomRecipe(dto);
  }
}
