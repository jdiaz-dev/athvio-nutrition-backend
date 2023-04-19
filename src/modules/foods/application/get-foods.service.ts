import { Injectable } from '@nestjs/common';
import { Food, GetFoodsDto } from 'src/modules/foods/adapters/in/dtos/get-foods.dto';
import { FoodHint, Measure } from 'src/modules/foods/adapters/out/providers/food.types';
import { FoodsProviderService } from 'src/modules/foods/adapters/out/providers/foods-provider.service';
import { CustomRecipesPersistenceService } from 'src/modules/professionals/custom-recipes/adapters/out/custom-recipes-persistence.service';

@Injectable()
export class GetFoodsService {
  constructor(private fps: FoodsProviderService, private crps: CustomRecipesPersistenceService) {}

  private transformMeasure(measures: Measure[]) {
    return measures
      .filter((measure) => measure.label !== 'Whole' && measure.label !== 'Kilogram')
      .map((measure) => {
        return {
          uri: measure.uri,
          label: measure.label ? measure.label : 'default',
          weight: measure.weight,
        };
      });
  }
  private transformFood(foods: FoodHint[]): Food[] {
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
      measures: this.transformMeasure(item.measures),
    }));
    return res;
  }
  async getFoods({ professional, ...rest }: GetFoodsDto): Promise<Food[]> {
    const foodsFromProvider = await this.fps.getFoods(rest.search.join(' '));
    const totalParsedFoods = foodsFromProvider.parsed.length;

    const dto = {
      professional,
      search: rest.search,
      limit: 2,
      offset: 0,
      orderBy: 'name',
    };

    const graphqlSelectors = {
      name: 1,
    };
    this.crps.getCustomRecipes(dto, graphqlSelectors);

    if (totalParsedFoods === 0) {
      return this.transformFood(foodsFromProvider.hints);
    } else {
      //the first hints correspond to the parsed foods
      return this.transformFood(foodsFromProvider.hints.slice(0, totalParsedFoods));
    }
  }
}
