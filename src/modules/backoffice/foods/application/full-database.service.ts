import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { InternalCountersPersistenceService } from 'src/modules/backoffice/foods/adapters/out/internal-counters-persistence.service';
import { InternalFoodsPersistenceService } from 'src/modules/backoffice/foods/adapters/out/internal-foods-persistence.service';
import { NextLink } from 'src/modules/backoffice/foods/adapters/out/providers/food.types';
import { FoodsProviderService } from 'src/modules/backoffice/foods/adapters/out/providers/foods-provider.service';
import { TranslatorService } from 'src/modules/backoffice/foods/adapters/out/providers/translator.service';

//black beans
//arroz salvaje
//judias verdes
//champiñones
//tofu
//gallina
const allFoods2: string[] = ['psyllium husk', 'olive oil'];
//todo: delete this class
@Injectable()
export class FullDatabaseService {
  constructor(
    private readonly translatorService: TranslatorService,
    private readonly foodProvider: FoodsProviderService,
    private readonly ifps: InternalFoodsPersistenceService,
    private readonly icps: InternalCountersPersistenceService,
  ) {}
  private getNextSession(nextLink: NextLink): string {
    const nextLinkParams = nextLink.href.split('?')[1];
    const sessionParam = nextLinkParams.split('&')[0];
    const nextSessionValue = sessionParam.split('=')[1];
    return nextSessionValue;
  }

  async fullFoods(): Promise<void> {
    const lastCounter = await this.icps.getLastInternalCounter();

    let nextSession: string | undefined =
      lastCounter !== undefined ? this.getNextSession({ title: '', href: lastCounter.nextUri }) : undefined;
    setInterval(async () => {
      const foods = await this.foodProvider.getFoodsAndUri('', nextSession);
      nextSession = this.getNextSession(foods[0]._links.next);

      const englishWords = foods[0].hints.map((item) => item.food.label);
      const spanishWords = await this.translatorService.translate({ words: englishWords, source: 'en', target: 'es' });
      const records = foods[0].hints.map(({ food, measures }, index) => ({
        uuid: randomUUID(),
        measures,
        foodDetails: { ...food, label: spanishWords[index] },
      }));

      const foodsSaved = await this.ifps.saveInternalFoods(records);
      await this.icps.saveInternalCounter({
        uuid: randomUUID(),
        total: foodsSaved.length,
        uri: foods[1],
        nextUri: foods[0]._links.next.href,
      });
    }, 10000);
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
