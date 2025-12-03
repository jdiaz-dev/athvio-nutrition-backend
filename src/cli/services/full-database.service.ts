import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { InternalFoodsPersistenceService } from 'src/shared/adapters/out/database/internal-foods-persistence.service';
import { FoodsProviderService } from 'src/shared/application/foods-provider.service';
import { TranslatorService } from 'src/cli/services/translator.service';

//milk
const allFoods2: string[] = [];

@Injectable()
export class FullDatabaseService {
  constructor(
    private readonly translatorService: TranslatorService,
    private readonly foodProvider: FoodsProviderService,
    private readonly ifps: InternalFoodsPersistenceService,
  ) {}

  async fullFoods(): Promise<void> {
    setInterval(async () => {
      const foods = await this.foodProvider.getFoodsAndUri('');

      const englishWords = foods[0].hints.map((item) => item.food.label);
      const spanishWords = await this.translatorService.translate({ words: englishWords, source: 'en', target: 'es' });
      const records = foods[0].hints.map(({ food, measures }, index) => ({
        uuid: randomUUID(),
        measures,
        foodDetails: { ...food, label: spanishWords[index] },
      }));

      await this.ifps.saveInternalFoods(records);
    }, 1000);
  }

  async fullNamedFoods(): Promise<void> {
    const existingFoods = await this.ifps.getInternalFoodsByNames(allFoods2);
    const filteredFoods = allFoods2.filter(
      (item) => !existingFoods.some(({ foodDetails }) => foodDetails.label.toLowerCase() === item.toLowerCase()),
    );
    let counter = 0;
    const intervalId = setInterval(async () => {
      if (filteredFoods[counter] === undefined) {
        console.log('All foods processed.');
        clearInterval(intervalId);
        return;
      }
      const foodObtained = await this.foodProvider.getFoodsAndUri(filteredFoods[counter]);
      const foundInternalFoods = await this.ifps.getInternalFoodsByNames(foodObtained[0].hints.map(({ food }) => food.label));

      const englishWords = foodObtained[0].hints.map((item) => item.food.label);
      const spanishWords = await this.translatorService.translate({ words: englishWords, source: 'en', target: 'es' });
      const foodsTranslated = foodObtained[0].hints.map(({ food, measures }, index) => ({
        uuid: randomUUID(),
        measures,
        foodDetails: { ...food, label: spanishWords[index] },
      }));

      const records = foodsTranslated.filter(
        (item) =>
          !foundInternalFoods.some(({ foodDetails }) => foodDetails.label.toLowerCase() === item.foodDetails.label.toLowerCase()),
      );

      await this.ifps.saveInternalFoods(records);

      counter++;
    }, 1000);
  }
}
