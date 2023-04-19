import { Injectable } from '@nestjs/common';
import { GetAutocompleteFoodNamesDto } from 'src/modules/foods/adapters/in/dtos/get-autocomplete-food-names.dto';
import { FoodsProviderService } from 'src/modules/foods/adapters/out/providers/foods-provider.service';
import { CustomRecipesPersistenceService } from 'src/modules/professionals/custom-recipes/adapters/out/custom-recipes-persistence.service';
import { FoodDatabases } from 'src/shared/enums/project';

@Injectable()
export class FoodTextSearcherService {
  constructor(private readonly fps: FoodsProviderService, private readonly crps: CustomRecipesPersistenceService) {}

  private async getFoodNamesFromCustomRecipes({ professional, search }: GetAutocompleteFoodNamesDto) {
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

    const customRecipes = await this.crps.getCustomRecipes(dto, graphqlSelectors);
    const res = customRecipes.data.map((recipe) => recipe.name);
    return res;
  }
  getFoodNamesFromProvider(search: string) {
    return this.fps.autoCompleteText(search);
  }
  async getFoodNames(dto: GetAutocompleteFoodNamesDto): Promise<string[]> {
    if (dto.foodDatabase === FoodDatabases.SYSTEM) {
      return this.fps.autoCompleteText(dto.search);
    } else if (dto.foodDatabase === FoodDatabases.CUSTOM_RECIPES) {
      return this.getFoodNamesFromCustomRecipes(dto);
    }

    const [foodsProvider, customRecipes] = await Promise.all([
      this.fps.autoCompleteText(dto.search),
      this.getFoodNamesFromCustomRecipes(dto),
    ]);
    const res = [...foodsProvider, ...customRecipes];
    return res;
  }
}
