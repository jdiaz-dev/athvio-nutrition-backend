import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FoodsProviderService } from 'src/shared/application/foods-provider.service';
import { TranslatorService } from 'src/cli/services/translator.service';
import { InternalFoodsDaoService } from 'src/cli/services/internal-foods-dao.service';
import { spanishLabelMap } from 'src/cli/constants/cli-constants';

//milk
const allFoods: string[] = [];

@Injectable()
export class FullDatabaseService {
  constructor(
    private readonly translatorService: TranslatorService,
    private readonly foodProvider: FoodsProviderService,
    private readonly ifds: InternalFoodsDaoService,
  ) {}
  async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async updateNutrientDetails() {
    const totalFoods = 11;
    const limit = 1;
    for (let offset = 0; offset < totalFoods; offset++) {
      try {
        const food = await this.ifds.getInternalFoods({ offset, limit, search: [] });
        // console.log(food.data[0].foodDetails.foodId);
        const { dietLabels, healthLabels, totalNutrients } = await this.foodProvider.getFoodNutrients({
          ingredients: [
            {
              quantity: 100,
              measureURI: 'http://www.edamam.com/ontologies/edamam.owl#Measure_gram',
              foodId: food.data[0].foodDetails.foodId,
            },
          ],
        });
        let nutrientDetails: any = {};
        for (const key in totalNutrients) {
          nutrientDetails[key] = {
            ...totalNutrients[key],
            ...(spanishLabelMap[key] && { spanishLabel: spanishLabelMap[key] }),
          };
        }
        try {
          await this.ifds.updateFoods({
            foodId: food.data[0].foodDetails.foodId,
            body: {
              dietLabels,
              healthLabels,
              nutrientDetails,
              stayedOffset: offset,
              isSuccessfullUpdated: true,
            },
          });
        } catch (error) {
          await this.ifds.updateFoods({
            foodId: food.data[0].foodDetails.foodId,
            body: { stayedOffset: offset, isSuccessfullUpdated: false },
          });
        }
      } catch (error) {
        console.log(`Error at offset ${offset}:`, error);
      }
      console.log(offset);
      await this.sleep(1000);
    }
  }
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

      await this.ifds.saveInternalFoods(records);
    }, 1000);
  }

  async fullNamedFoods(): Promise<void> {
    const existingFoods = await this.ifds.getInternalFoodsByNames(allFoods);
    const filteredFoods = allFoods.filter(
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
      const foundInternalFoods = await this.ifds.getInternalFoodsByNames(foodObtained[0].hints.map(({ food }) => food.label));

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

      await this.ifds.saveInternalFoods(records);

      counter++;
    }, 1000);
  }
}
