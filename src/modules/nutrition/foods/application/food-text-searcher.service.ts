import { Injectable } from '@nestjs/common';
import { GetAutocompleteFoodNamesDto } from 'src/modules/nutrition/foods/adapters/in/dtos/get-autocomplete-food-names.dto';
import { InternalFoodsPersistenceService } from 'src/modules/nutrition/foods/adapters/out/internal-foods-persistence.service';
import { FoodsProviderService } from 'src/shared/services/foods-provider.service';
import { FoodDatabases, SupportedLanguages } from 'src/shared/enums/project';

@Injectable()
export class FoodTextSearcherService {
  constructor(private readonly fps: FoodsProviderService, private readonly ifps: InternalFoodsPersistenceService) {}

  async getFoodNamesFromProvider(search: string): Promise<string[]> {
    return this.fps.autoCompleteText(search);
  }

  async getFoodNames({ targetLanguage, ...restDto }: GetAutocompleteFoodNamesDto): Promise<string[]> {
    if (targetLanguage === SupportedLanguages.SPANISH && restDto.foodDatabase === FoodDatabases.SYSTEM) {
      const foods = await this.ifps.getInternalFoods({ search: [restDto.search], offset: 0, limit: 15 });
      return foods.data.map(({ foodDetails }) => foodDetails.label);
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
