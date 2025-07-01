import { Injectable } from '@nestjs/common';
import { GetFoodsDto, GetFoodsResponse } from 'src/modules/backoffice/foods/adapters/in/dtos/get-foods.dto';
import { InternalFoodsPersistenceService } from 'src/modules/backoffice/foods/adapters/out/internal-foods-persistence.service';
import { FoodParserService } from 'src/modules/backoffice/foods/application/foods-parser.service';
import { FoodsProviderService } from 'src/modules/backoffice/foods/adapters/out/providers/foods-provider.service';
import { FoodDatabases, SupportedLanguages } from 'src/shared/enums/project';

@Injectable()
export class GetFoodsService {
  constructor(
    private readonly foodsParser: FoodParserService,
    private readonly foodProvider: FoodsProviderService,
    private readonly ifps: InternalFoodsPersistenceService,
  ) {}

  async getFoods({ targetLanguage, ...restDto }: GetFoodsDto): Promise<GetFoodsResponse> {
    if (targetLanguage === SupportedLanguages.ENGLISH && restDto.foodDatabase === FoodDatabases.SYSTEM) {
      const foodsFromProvider = await this.foodProvider.getFoods(restDto.search.join(' '), restDto.session);

      const foodsInEnglish = await this.foodsParser.parseFoods({ ...restDto, search: restDto.search }, foodsFromProvider);
      return foodsInEnglish;
    }
    const { data, meta } = await this.ifps.getInternalFoods(restDto);

    const [parsedFoods] = await Promise.all([
      this.foodsParser.parseFoods(restDto, {
        hints: data.map(({ foodDetails, measures }) => ({ food: foodDetails, measures })),
      }),
    ]);

    return {
      data: [...parsedFoods.data],
      meta,
    };
  }
}
