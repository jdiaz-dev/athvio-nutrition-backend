import { Injectable } from '@nestjs/common';
import { Food, GetFoodsDto, GetFoodsResponse, Measure } from 'src/modules/foods/adapters/in/dtos/get-foods.dto';
import { FoodHint, FoodMeasure, NextLink } from 'src/modules/foods/adapters/out/providers/food.types';
import { FoodsProviderService } from 'src/modules/foods/adapters/out/providers/foods-provider.service';
import { defaultSizePageFoodProvider } from 'src/shared/enums/project';

@Injectable()
export class SerializeFoodsFromProviderService {
  constructor(private readonly foodProvider: FoodsProviderService) {}

  private getNextSession(nextLink: NextLink) {
    const nextLinkParams = nextLink.href.split('?')[1];
    const sessionParam = nextLinkParams.split('&')[0];
    const nextSessionValue = sessionParam.split('=')[1];

    return parseInt(nextSessionValue);
  }
  private transformMeasure(measures: FoodMeasure[]): Measure[] {
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
      name: item.food.label,
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
  async getFoodFromProvider(dto: GetFoodsDto): Promise<GetFoodsResponse> {
    const foodsFromProvider = await this.foodProvider.getFoods(dto.search.join(' '), dto.session);
    const totalParsedFoods = foodsFromProvider.parsed.length;

    const meta = {
      total: foodsFromProvider._links.next
        ? foodsFromProvider.hints.length + defaultSizePageFoodProvider
        : foodsFromProvider.hints.length,
      limit: dto.limit,
      offset: dto.offset,
    };

    let res: GetFoodsResponse;
    if (totalParsedFoods === 0) {
      res = {
        data: this.transformFood(foodsFromProvider.hints),
        meta,
      };
    } else {
      res = {
        //the first hints correspond to the parsed foods
        data: this.transformFood(foodsFromProvider.hints.slice(0, totalParsedFoods)),
        meta,
      };
    }
    if (foodsFromProvider._links.next) {
      res = {
        data: [...res.data],
        meta: {
          ...res.meta,
          foodProviderSessions: {
            title: foodsFromProvider._links.next.title,
            nextSession: this.getNextSession(foodsFromProvider._links.next),
          },
        },
      };
    }
    return res;
  }
}
