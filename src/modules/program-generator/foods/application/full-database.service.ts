import { Injectable } from '@nestjs/common';
import { InternalCountersPersistenceService } from 'src/modules/program-generator/foods/adapters/out/internal-counters-persistence.service';
import { InternalFoodsPersistenceService } from 'src/modules/program-generator/foods/adapters/out/internal-foods-persistence.service';
import { NextLink } from 'src/modules/program-generator/foods/adapters/out/providers/food.types';
import { FoodsProviderService } from 'src/modules/program-generator/foods/adapters/out/providers/foods-provider.service';
import { TranslatorService } from 'src/modules/program-generator/foods/adapters/out/providers/translator.service';

const fruits = [
  'apple',
  'apricot',
  'banana',
  'blackberry',
  'blood orange',
  'blueberry',
  'cantaloupe', //melon
  'cherry',
  'coconut',
  'cranberry',
  'currant',
  'date', //datiles
  'dragon fruit',
  'fig',
  'gooseberry',
  'grape',
  'guava',
  'honeydew', //melon
  'jackfruit',
  'kiwi',
  'lychee',
  'mango',
  'melon',
  'mulberry',
  'nectarine',
  'orange',
  'papaya',
  'passion fruit',
  'peach',
  'pear',
  'persimmon',
  'pineapple',
  'plum',
  'pomegranate',
  'raspberry',
  'rhubarb',
  'soursop',
  'star fruit',
  'strawberry',
  'tangerine',
  'watermelon',
];

const vegetables = [
  'artichoke',
  'arugula',
  'asparagus',
  'beetroot',
  'bell pepper',
  'bok choy',
  'broccoli',
  'brussels sprout',
  'butternut squash',
  'cabbage',
  'carrot',
  'cauliflower',
  'celery',
  'chard',
  'chayote',
  'collard greens',
  'corn',
  'cucumber',
  'daikon',
  'eggplant',
  'endive',
  'fennel',
  'garlic',
  'ginger',
  'green bean',
  'jicama',
  'kale',
  'kohlrabi',
  'leek',
  'lettuce',
  'mushroom',
  'mustard greens',
  'okra',
  'onion',
  'parsnip',
  'peas',
  'potato',
  'pumpkin',
  'radicchio',
  'radish',
  'spinach',
  'squash',
  'sweet potato',
  'swiss chard',
  'tomato',
  'turnip',
  'watercress',
  'zucchini',
];

const grains = [
  'amaranth',
  'arborio rice',
  'barley',
  'basmati rice',
  'black rice',
  'brown rice',
  'buckwheat',
  'bulgur',
  'cornmeal',
  'couscous',
  'farro',
  'jasmine rice',
  'millet',
  'oats',
  'quinoa',
  'red rice',
  'rice',
  'rye',
  'sorghum',
  'spelt',
  'teff',
  'wheat',
  'white rice',
  'wild rice',

  'Triticale',
  'Fonio',
  'Buckwheat',
  'Freekeh',
  'Kamut',
  'Canary seed',
  'Einkorn',
];

const legumes = [
  'Lentils',
  'Chickpeas',
  'Black beans',
  'Kidney beans',
  'Pinto beans',
  'Navy beans',
  'Great Northern beans',
  'Cannellini beans',
  'Adzuki beans',
  'Mung beans',
  'Soybeans',
  'Edamame',
  'Green peas',
  'Split peas',
  'Snow peas',
  'Sugar snap peas',
  'Fava beans',
  'Broad beans',
  'Lima beans',
  'Butter beans',
  'Horse gram',
  'Pigeon peas',
  'Cowpeas',
  'Black-eyed peas',
  'Red lentils',
  'Yellow lentils',
  'White beans',
  'Roman beans',
  'Tepary beans',
  'Field peas',
  'Hyacinth beans',
  'Velvet beans',
  'Winged beans',
  'Jack beans',
  'Moth beans',
  'Bambara groundnuts',
  'Cluster beans (Guar)',
  'Green gram',
  'Lablab beans',
  'Rice beans',
  'Scarlet runner beans',
  'Pink beans',
  'Marrowfat peas',
  'Zolfino beans',
  'Flageolet beans',
  'Yin Yang beans',
];

const meats = [
  'anchovy',
  'bass',
  'beef',
  'bison',
  'catfish',
  'chicken',
  'clam',
  'cod',
  'crab',
  'duck',
  'elk',
  'emu',
  'fish',
  'flounder',
  'guinea pig',
  'goose',
  'grouper',
  'halibut',
  'herring',
  'kangaroo',
  'lamb',
  'lobster',
  'mackerel',
  'mahi-mahi',
  'mussel',
  'meat',
  'octopus',
  'ostrich',
  'oyster',
  'pheasant',
  'pollock',
  'pork',
  'quail',
  'rabbit',
  'salmon',
  'sardine',
  'scad',
  'scallop',
  'sea bass',
  'shrimp',
  'snapper',
  'sole',
  'squid',
  'swordfish',
  'tilapia',
  'trout',
  'tuna',
  'turkey',
  'venison',
];

const allFoods = [...fruits, ...vegetables, ...grains, ...legumes, ...meats];
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
        measures,
        foodDetails: { ...food, label: spanishWords[index] },
      }));

      const foodsSaved = await this.ifps.saveInternalFoods(records);
      await this.icps.saveInternalCounter({ total: foodsSaved.length, uri: foods[1], nextUri: foods[0]._links.next.href });
    }, 10000);
  }

  async fullNamedFoods(): Promise<void> {
    const existingFoods = await this.ifps.getInternalFoodsByNames(allFoods);
    const filteredFoods = allFoods.filter(
      (item) => !existingFoods.some(({ foodDetails }) => foodDetails.label.toLowerCase() === item.toLowerCase()),
    );
    let counter = 0;
    const intervalId = setInterval(async () => {
      if (filteredFoods[counter] === undefined) {
        clearInterval(intervalId);
        return;
      }
      const foodObtained = await this.foodProvider.getFoodsAndUri(filteredFoods[counter]);
      const foundInternalFoods = await this.ifps.getInternalFoodsByNames(foodObtained[0].hints.map(({ food }) => food.label));

      const englishWords = foodObtained[0].hints.map((item) => item.food.label);
      const spanishWords = await this.translatorService.translate({ words: englishWords, source: 'en', target: 'es' });
      const foodsTranslated = foodObtained[0].hints.map(({ food, measures }, index) => ({
        measures,
        foodDetails: { ...food, label: spanishWords[index] },
      }));

      const records = foodsTranslated.filter(
        (item) =>
          !foundInternalFoods.some(({ foodDetails }) => foodDetails.label.toLowerCase() === item.foodDetails.label.toLowerCase()),
      );

      await this.ifps.saveInternalFoods(records);

      counter++;
    }, 10000);
  }
}
