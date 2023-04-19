import { Injectable } from '@nestjs/common';
import { Food, GetFoodsDto, GetFoodsResponse, Measure } from 'src/modules/foods/adapters/in/dtos/get-foods.dto';
import { FoodHint, FoodMeasure } from 'src/modules/foods/adapters/out/providers/food.types';
import { FoodsProviderService } from 'src/modules/foods/adapters/out/providers/foods-provider.service';
import { CustomRecipesPersistenceService } from 'src/modules/professionals/custom-recipes/adapters/out/custom-recipes-persistence.service';
import { defaultSizePageFoodProvider, FoodDatabases } from 'src/shared/enums/project';

@Injectable()
export class GetFoodsService {
  constructor(private readonly fps: FoodsProviderService, private readonly crps: CustomRecipesPersistenceService) {}

  async getFoodFromProvider(dto: GetFoodsDto): Promise<GetFoodsResponse> {
    const transformMeasure = (measures: FoodMeasure[]): Measure[] => {
      return measures
        .filter((measure) => measure.label !== 'Whole' && measure.label !== 'Kilogram')
        .map((measure) => {
          return {
            uri: measure.uri,
            label: measure.label ? measure.label : 'default',
            weight: measure.weight,
          };
        });
    };
    const transformFood = (foods: FoodHint[]): Food[] => {
      const res = foods.map((item) => ({
        name: item.food.knownAs,
        macros: {
          protein: item.food.nutrients.PROCNT,
          carbs: item.food.nutrients.CHOCDF,
          fat: item.food.nutrients.FAT,
          calories: item.food.nutrients.ENERC_KCAL,
        },
        defaultMeasure: {
          amount: 100,
          unit: 'g',
        },
        foodId: item.food.foodId,
        measures: transformMeasure(item.measures),
      }));
      return res;
    };

    const foodsFromProvider = await this.fps.getFoods(dto.search.join(' '));
    const totalParsedFoods = foodsFromProvider.parsed.length;

    const meta = {
      total: foodsFromProvider._links.next
        ? foodsFromProvider.hints.length + defaultSizePageFoodProvider
        : foodsFromProvider.hints.length,
      limit: dto.limit,
      offset: dto.offset,
    };

    if (totalParsedFoods === 0) {
      return {
        data: transformFood(foodsFromProvider.hints),
        meta,
      };
    } else {
      return {
        //the first hints correspond to the parsed foods
        data: transformFood(foodsFromProvider.hints.slice(0, totalParsedFoods)),
        meta,
      };
    }
  }
  async getFoodFromCustomRecipes(dto: GetFoodsDto) {
    const graphqlSelectors = {
      'name': 1,
      'totalWeight': 1,
      'macros.protein': 1,
      'macros.carbs': 1,
      'macros.fat': 1,
      'macros.calories': 1,
    };

    const { data, meta } = await this.crps.getCustomRecipes(dto, graphqlSelectors);
    return {
      data: data.map((recipe) => ({
        name: recipe.name,
        macros: recipe.macros,
        defaultMeasure: { amount: recipe.totalWeight, unit: 'g' },
      })),
      meta,
    };
  }
  async getFoods(dto: GetFoodsDto): Promise<GetFoodsResponse> {
    //default search
    if (dto.foodDatabase === FoodDatabases.ALL && dto.search[0] === '') {
      return this.getFoodFromProvider(dto);
    }
    if (dto.foodDatabase === FoodDatabases.SYSTEM) {
      return this.getFoodFromProvider(dto);
    }
    if (dto.foodDatabase === FoodDatabases.CUSTOM_RECIPES) {
      return this.getFoodFromCustomRecipes(dto);
    }

    const [providerFoods, customRecipes] = await Promise.all([this.getFoodFromProvider(dto), this.getFoodFromCustomRecipes(dto)]);
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
