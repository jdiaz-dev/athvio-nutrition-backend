import { Injectable } from '@nestjs/common';
import { InternalCountersPersistenceService } from 'src/modules/program-generator/foods/adapters/out/internal-counters-persistence.service';
import { InternalFoodsPersistenceService } from 'src/modules/program-generator/foods/adapters/out/internal-foods-persistence.service';
import { NextLink } from 'src/modules/program-generator/foods/adapters/out/providers/food.types';
import { FoodsProviderService } from 'src/modules/program-generator/foods/adapters/out/providers/foods-provider.service';
import { TranslatorService } from 'src/modules/program-generator/foods/adapters/out/providers/translator.service';

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
    this.getNextSession;
    this.translatorService;
    this.foodProvider;
    this.ifps;
    const lastCounter = await this.icps.getLastInternalCounter();

    let nextSession: string | undefined =
      lastCounter !== undefined ? this.getNextSession({ title: '', href: lastCounter.nextUri }) : undefined;
    setInterval(async () => {
      const foods = await this.foodProvider.getFoodsAndUri('', nextSession);
      nextSession = this.getNextSession(foods[0]._links.next);

      const englishWords = foods[0].hints.map((item) => item.food.label);
      const spanishWords = await this.translatorService.translate({ words: englishWords, source: 'en', target: 'es' });
      const records = foods[0].hints.map(({ food, measures }, index) => ({
        measures,
        foodDetails: { ...food, label: spanishWords[index] },
      }));

      const foodsSaved = await this.ifps.saveInternalFoods(records);
      await this.icps.saveInternalCounter({ total: foodsSaved.length, uri: foods[1], nextUri: foods[0]._links.next.href });
    }, 10000);
  }
}
