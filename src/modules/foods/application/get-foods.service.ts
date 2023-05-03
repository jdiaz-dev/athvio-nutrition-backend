import { Injectable } from '@nestjs/common';
import { GetFoodsDto, GetFoodsResponse } from 'src/modules/foods/adapters/in/dtos/get-foods.dto';
import { CustomRecipesTransformerService } from 'src/modules/foods/application/custom-recipes-transformer.service';
import { ProviderFoodTransformerService } from 'src/modules/foods/application/provider-foods-transformer.service';
import { FoodDatabases } from 'src/shared/enums/project';

@Injectable()
export class GetFoodsService {
  constructor(
    private readonly customRecipesTransformer: CustomRecipesTransformerService,
    private readonly foodsTransformer: ProviderFoodTransformerService,
  ) {}

  async getFoods(dto: GetFoodsDto, selectors: Record<string, number>): Promise<GetFoodsResponse> {
    //default search
    if (dto.foodDatabase === FoodDatabases.ALL && dto.search[0] === '') {
      return this.foodsTransformer.getFoodFromProvider(dto);
    }
    if (dto.foodDatabase === FoodDatabases.SYSTEM) {
      return this.foodsTransformer.getFoodFromProvider(dto);
    }
    if (dto.foodDatabase === FoodDatabases.CUSTOM_RECIPES) {
      return this.customRecipesTransformer.getFoodFromCustomRecipes(dto, selectors);
    }

    const [providerFoods, customRecipes] = await Promise.all([
      this.foodsTransformer.getFoodFromProvider(dto),
      this.customRecipesTransformer.getFoodFromCustomRecipes(dto, selectors),
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
