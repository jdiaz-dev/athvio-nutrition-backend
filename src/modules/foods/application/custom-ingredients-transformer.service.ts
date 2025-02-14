import { Injectable } from '@nestjs/common';
import { Food, GetFoodsDto, GetFoodsResponse } from 'src/modules/foods/adapters/in/dtos/get-foods.dto';
import { CustomRecipesPersistenceService } from 'src/modules/professionals/custom-recipes/adapters/out/custom-recipes-persistence.service';
import { FoodDatabases, weightIngrams } from 'src/shared/enums/project';
import { Macros } from 'src/shared/models/macros';

// todo: remove this class ?
// this class may be necessary to transform data from custom ingredients
@Injectable()
export class CustomIngredientsTransformerService {
  constructor(private readonly customRecipesPersistence: CustomRecipesPersistenceService) {}

  private calculateMacrosFixingDecimals(weightRef: number, macroRef: number): number {
    if (macroRef <= 0) return 0;
    const numerator = Math.round((Math.round(weightIngrams * 100) / 100) * (Math.round(macroRef * 100) / 100) * 100) / 100;
    const demoninator = Math.round(weightRef * 100) / 100;
    const res = Math.round((numerator / demoninator) * 100) / 100;
    return res;
  }

  private macrosFor100Grams(macrosRef: Macros): Macros {
    const macros: Macros = {
      protein: this.calculateMacrosFixingDecimals(macrosRef.weightInGrams, macrosRef.protein),
      carbs: this.calculateMacrosFixingDecimals(macrosRef.weightInGrams, macrosRef.carbs),
      fat: this.calculateMacrosFixingDecimals(macrosRef.weightInGrams, macrosRef.fat),
      calories: this.calculateMacrosFixingDecimals(macrosRef.weightInGrams, macrosRef.calories),
      weightInGrams: weightIngrams,
    };
    return macros;
  }
  async getFoodFromCustomRecipes(dto: GetFoodsDto, selectors: Record<string, number>): Promise<GetFoodsResponse> {
    const choosedSelectors = { ...selectors };
    for (const key in choosedSelectors) {
      if (
        !(
          key.includes('name') ||
          key.includes('macros') ||
          key.includes('ingredientDetails') ||
          key.includes('offset') ||
          key.includes('limit')
        )
      ) {
        delete choosedSelectors[key];
      }
    }

    const { data, meta } = await this.customRecipesPersistence.getCustomRecipes(dto, choosedSelectors);
    const customRecipesForFood: Food[] = data.map((recipe) => {
      const res: Food = {
        name: recipe.name,
        macros: this.macrosFor100Grams(recipe.macros),
        foodDatabase: FoodDatabases.ALL, //replace for custom ingredients
        ingredientDetails: recipe.ingredientDetails,
        availableMeasures: [{ label: 'Gram', weightInGrams: 1 }],
      };
      return res;
    });

    return {
      data: customRecipesForFood,
      meta,
    };
  }
}
