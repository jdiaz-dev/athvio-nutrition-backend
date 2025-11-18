import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { Food, FoodsMeta, GetFoodsResponse, Measure } from 'src/modules/nutrition/foods/adapters/in/dtos/get-foods.dto';
import {
  FoodHint,
  FoodMeasure,
  FoodParsedResponse,
  NextLink,
} from 'src/modules/nutrition/foods/adapters/out/providers/food.types';
import { GetFoods } from 'src/modules/nutrition/foods/helpers/foods';
import { ErrorFoodsProvider } from 'src/shared/enums/messages-response';
import { defaultSizePageFoodProvider, FoodDatabases, LayersServer } from 'src/shared/enums/project';

@Injectable()
export class FoodParserService {
  constructor(private readonly logger: AthvioLoggerService) {}

  private getNextSession(nextLink: NextLink): string {
    const nextLinkParams = nextLink.href.split('?')[1];
    const sessionParam = nextLinkParams.split('&')[0];
    const nextSessionValue = sessionParam.split('=')[1];
    return nextSessionValue;
  }
  private transformMeasure(measures: FoodMeasure[]): Measure[] {
    return measures
      .filter((measure) => measure.label && measure.label !== 'Whole' && measure.label !== 'Kilogram')
      .map((measure) => {
        return {
          uri: measure.uri,
          label: measure.label,
          weightInGrams: parseFloat(Number(measure.weight).toFixed(2)),
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
        weightInGrams: 100,
      },
      foodDatabase: FoodDatabases.SYSTEM,
      foodId: item.food.foodId,
      availableMeasures: this.transformMeasure(item.measures),
    }));
    return res;
  }
  private parseData(totalParsedFoods: number, foodsFromProvider: FoodParsedResponse, meta: FoodsMeta): GetFoodsResponse {
    try {
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

      if (foodsFromProvider._links?.next) {
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
    } catch (error) {
      this.logger.error({ layer: LayersServer.APPLICATION, error, message: (error as Error).message });
      throw new InternalServerErrorException(ErrorFoodsProvider.FOOD_INTERNAL_PARSER);
    }
  }
  async parseFoods(dto: GetFoods, foodsFromProvider: FoodParsedResponse): Promise<GetFoodsResponse> {
    const totalParsedFoods = foodsFromProvider.parsed?.length || 0;

    const meta = {
      total: foodsFromProvider._links?.next
        ? foodsFromProvider.hints.length + defaultSizePageFoodProvider
        : foodsFromProvider.hints.length,
      limit: dto.limit,
      offset: dto.offset,
    };

    const dataParsed = this.parseData(totalParsedFoods, foodsFromProvider, meta);
    return dataParsed;
  }
}
