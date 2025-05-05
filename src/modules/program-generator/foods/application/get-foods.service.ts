import { Injectable } from '@nestjs/common';
import { GetFoodsDto, GetFoodsResponse } from 'src/modules/program-generator/foods/adapters/in/dtos/get-foods.dto';
import { InternalFoodsPersistenceService } from 'src/modules/program-generator/foods/adapters/out/internal-foods-persistence.service';
import { FoodParserService } from 'src/modules/program-generator/foods/application/foods-parser.service';
import { FoodsProviderService } from 'src/modules/program-generator/foods/adapters/out/providers/foods-provider.service';
import { LanguagesEnum } from 'src/modules/program-generator/foods/helpers/constants';
import { FoodDatabases } from 'src/shared/enums/project';

@Injectable()
export class GetFoodsService {
  constructor(
    private readonly foodsParsed: FoodParserService,
    private readonly foodProvider: FoodsProviderService,
    private readonly ifps: InternalFoodsPersistenceService,
  ) {}

  async getFoods({ targetLanguage, ...restDto }: GetFoodsDto): Promise<GetFoodsResponse> {
    if (targetLanguage === LanguagesEnum.EN && restDto.foodDatabase === FoodDatabases.SYSTEM) {
      const foodsFromProvider = await this.foodProvider.getFoods(restDto.search.join(' '), restDto.session);

      const foods = await this.foodsParsed.getFoodsParsed({ ...restDto, search: restDto.search }, foodsFromProvider);
      return foods;
    }
    const foods = await this.ifps.getInternalFoods(restDto);

    const [providerFoods] = await Promise.all([
      this.foodsParsed.getFoodsParsed(restDto, {
        hints: foods.map(({ foodDetails, measures }) => ({ food: foodDetails, measures })),
        parsed: [],
      }),
    ]);

    return {
      data: [...providerFoods.data],
      meta: {
        total: providerFoods.meta.total,
        limit: restDto.limit,
        offset: restDto.offset,
      },
    };
  }
}
