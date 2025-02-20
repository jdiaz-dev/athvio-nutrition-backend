import { Injectable } from '@nestjs/common';
import { GetAutocompleteFoodNamesDto } from 'src/modules/nutrition-generator/foods/adapters/in/dtos/get-autocomplete-food-names.dto';
import { FoodsProviderService } from 'src/modules/nutrition-generator/foods/adapters/out/providers/foods-provider.service';
import { FoodDatabases } from 'src/shared/enums/project';

@Injectable()
export class FoodTextSearcherService {
  constructor(private readonly fps: FoodsProviderService) {}

  getFoodNamesFromProvider(search: string): Promise<string[]> {
    return this.fps.autoCompleteText(search);
  }
  async getFoodNames(dto: GetAutocompleteFoodNamesDto): Promise<string[]> {
    if (dto.foodDatabase === FoodDatabases.SYSTEM) {
      return this.fps.autoCompleteText(dto.search);
    }

    //to support query to multiple databases
    const [foodsProvider] = await Promise.all([this.fps.autoCompleteText(dto.search)]);
    const res = [...foodsProvider];
    return res;
  }
}
