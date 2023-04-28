import { Injectable } from '@nestjs/common';
import { Food, GetFoodsDto, GetFoodsResponse } from 'src/modules/foods/adapters/in/dtos/get-foods.dto';
import { SerializeFoodsFromProviderService } from 'src/modules/foods/application/serialize-foods-from-provider.service';
import { CustomRecipesPersistenceService } from 'src/modules/professionals/custom-recipes/adapters/out/custom-recipes-persistence.service';
import { FoodDatabases } from 'src/shared/enums/project';

@Injectable()
export class GetFoodsService {
  constructor(
    private readonly crps: CustomRecipesPersistenceService,
    private readonly sfrps: SerializeFoodsFromProviderService,
  ) {}

  async getFoodFromCustomRecipes(dto: GetFoodsDto): Promise<GetFoodsResponse> {
    const graphqlSelectors = {
      'name': 1,
      'macros.protein': 1,
      'macros.carbs': 1,
      'macros.fat': 1,
      'macros.calories': 1,
      'macros.weightInGrams': 1,
    };

    const { data, meta } = await this.crps.getCustomRecipes(dto, graphqlSelectors);
    const customRecipesForFood: Food[] = data.map((recipe) => {
      const res = {
        name: recipe.name,
        macros: recipe.macros,
        foodDatabase: FoodDatabases.CUSTOM_RECIPES,
        feo: 'feo',
      };
      return res;
    });

    return {
      data: customRecipesForFood,
      meta,
    };
  }
  async getFoods(dto: GetFoodsDto): Promise<GetFoodsResponse> {
    //default search
    if (dto.foodDatabase === FoodDatabases.ALL && dto.search[0] === '') {
      return this.sfrps.getFoodFromProvider(dto);
    }
    if (dto.foodDatabase === FoodDatabases.SYSTEM) {
      return this.sfrps.getFoodFromProvider(dto);
    }
    if (dto.foodDatabase === FoodDatabases.CUSTOM_RECIPES) {
      return this.getFoodFromCustomRecipes(dto);
    }

    const [providerFoods, customRecipes] = await Promise.all([
      this.sfrps.getFoodFromProvider(dto),
      this.getFoodFromCustomRecipes(dto),
    ]);
    return {
      data: [...providerFoods.data, ...customRecipes.data],
      meta: {
        total: providerFoods.meta.total + customRecipes.meta.total,
        limit: dto.limit,
        offset: dto.offset,
      },
    };
  }
}
