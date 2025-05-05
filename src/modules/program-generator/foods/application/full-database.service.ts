import { Injectable } from '@nestjs/common';
import { InternalFoodsPersistenceService } from 'src/modules/program-generator/foods/adapters/out/internal-foods-persistence.service';
import { FoodsProviderService } from 'src/modules/program-generator/foods/adapters/out/providers/foods-provider.service';
import { TranslatorService } from 'src/modules/program-generator/foods/adapters/out/providers/translator.service';

//todo: delete this class
@Injectable()
export class FullDatabaseService {
  constructor(
    private readonly translatorService: TranslatorService,
    private readonly foodProvider: FoodsProviderService,
    private readonly ifps: InternalFoodsPersistenceService,
  ) {}

  async fullFoods(): Promise<void> {
    const foods = await this.foodProvider.getFoods();

    const englishWords = foods.hints.map((item) => item.food.label);
    const spanishWords = await this.translatorService.translate({ words: englishWords, source: 'en', target: 'es' });
    const records = foods.hints.map(({ food, measures }, index) => ({
      measures,
      foodDetails: { ...food, label: spanishWords[index] },
    }));

    await this.ifps.saveInternalFoods(records);
  }
}
