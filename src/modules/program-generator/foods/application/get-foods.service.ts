import { Injectable } from '@nestjs/common';
import { GetFoodsDto, GetFoodsResponse } from 'src/modules/program-generator/foods/adapters/in/dtos/get-foods.dto';
import { ProviderFoodTransformerService } from 'src/modules/program-generator/foods/adapters/out/providers/provider-foods-transformer.service';
import { TranslatorService } from 'src/modules/program-generator/foods/adapters/out/providers/translator.service';
import { LanguagesEnum } from 'src/modules/program-generator/foods/helpers/constants';
import { FoodDatabases } from 'src/shared/enums/project';

@Injectable()
export class GetFoodsService {
  constructor(
    private readonly translatorService: TranslatorService,
    private readonly foodsTransformer: ProviderFoodTransformerService,
  ) {}

  private async translateToSpanish(dto: Omit<GetFoodsDto, 'targetLanguage'>): Promise<GetFoodsResponse> {
    const englishWords = await this.translatorService.translate({ words: dto.search, source: 'es', target: 'en-US' });
    const foods = await this.foodsTransformer.getFoodFromProvider({ ...dto, search: englishWords });

    const englishNames = foods.data.map((item) => item.name);
    const spanishNames = await this.translatorService.translate({ words: englishNames, source: 'en', target: 'es' });
    foods.data = foods.data.map((item, index) => ({ ...item, name: spanishNames[index] }));
    return foods;
  }
  async getFoods({ targetLanguage, ...restDto }: GetFoodsDto): Promise<GetFoodsResponse> {
    if (targetLanguage === LanguagesEnum.ES && restDto.foodDatabase === FoodDatabases.SYSTEM) {
      return this.translateToSpanish(restDto);
    }

    if (targetLanguage === LanguagesEnum.EN && restDto.foodDatabase === FoodDatabases.SYSTEM) {
      const foods = await this.foodsTransformer.getFoodFromProvider({ ...restDto, search: restDto.search });
      return foods;
    }

    const [providerFoods] = await Promise.all([this.foodsTransformer.getFoodFromProvider(restDto)]);

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
