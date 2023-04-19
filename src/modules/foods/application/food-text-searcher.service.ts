import { Injectable } from '@nestjs/common';
import {
  GetAutocompleteFoodNamesDto,
  GetAutocompleteFoodNamesResponse,
} from 'src/modules/foods/adapters/in/dtos/get-autocomplete-food-names.dto';
import { FoodsProviderService } from 'src/modules/foods/adapters/out/providers/foods-provider.service';
import { CustomRecipesPersistenceService } from 'src/modules/professionals/custom-recipes/adapters/out/custom-recipes-persistence.service';

@Injectable()
export class FoodTextSearcherService {
  constructor(private fps: FoodsProviderService, private crps: CustomRecipesPersistenceService) {}

  async getFoodNames({ professional, search }: GetAutocompleteFoodNamesDto): Promise<GetAutocompleteFoodNamesResponse> {
    const dto = {
      professional,
      search: [search],
      limit: 2,
      offset: 0,
      orderBy: 'name',
    };

    const graphqlSelectors = {
      name: 1,
    };

    const [foodsProvider, customRecipes] = await Promise.all([
      this.fps.autoCompleteText(search),
      this.crps.getCustomRecipes(dto, graphqlSelectors),
    ]);
    const res = { foodNames: [...foodsProvider, ...customRecipes.data.map((recipe) => recipe.name)] };
    return res;
  }
}
