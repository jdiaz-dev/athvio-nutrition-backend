import { Injectable } from '@nestjs/common';
import { GetAutocompleteFoodNamesDto } from 'src/modules/program-generator/foods/adapters/in/dtos/get-autocomplete-food-names.dto';
import { FoodsProviderService } from 'src/modules/program-generator/foods/adapters/out/providers/foods-provider.service';
import { TranslatorService } from 'src/modules/program-generator/foods/adapters/out/providers/translator.service';
import { FoodDatabases, SupportedLanguages } from 'src/shared/enums/project';

@Injectable()
export class FoodTextSearcherService {
  constructor(private readonly ts: TranslatorService, private readonly fps: FoodsProviderService) {}

  async getFoodNamesFromProvider(search: string): Promise<string[]> {
    return this.fps.autoCompleteText(search);
  }

  private async translateToSpanish(dto: Omit<GetAutocompleteFoodNamesDto, 'targetLanguage'>): Promise<string[]> {
    const translatedWord = await this.ts.translate({ words: [dto.search], source: 'es', target: 'en-US' });
    const texts = await this.fps.autoCompleteText(translatedWord[0]);
    const translatedWords = await this.ts.translate({ words: texts, source: 'en', target: 'es' });
    return translatedWords;
  }
  async getFoodNames({ targetLanguage, ...restDto }: GetAutocompleteFoodNamesDto): Promise<string[]> {
    if (targetLanguage === SupportedLanguages.SPANISH && restDto.foodDatabase === FoodDatabases.SYSTEM) {
      return this.translateToSpanish(restDto);
    }

    if (targetLanguage === SupportedLanguages.ENGLISH && restDto.foodDatabase === FoodDatabases.SYSTEM) {
      return await this.fps.autoCompleteText(restDto.search);
    }

    //to support query to multiple databases
    const [foodsProvider] = await Promise.all([this.fps.autoCompleteText(restDto.search)]);
    const res = [...foodsProvider];
    return res;
  }
}
