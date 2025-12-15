import { Injectable } from '@nestjs/common';
import { CalculateNutrientsByMeasureDto } from 'src/modules/nutrition/foods/adapters/in/dtos/calculate-food-nutrients.dto';
import { CalculateFoodsNutrientsDto } from 'src/modules/nutrition/foods/adapters/in/dtos/calculate-foods-nutrients.dto';
import { InternalFoodsPersistenceService } from 'src/modules/nutrition/foods/adapters/out/internal-foods-persistence.service';
import { NutrientDetails } from 'src/shared/adapters/out/schemas/internal-food.schema';

@Injectable()
export class NutrientsCalculatorService {
  private readonly _100grams = 100;
  constructor(private readonly ifps: InternalFoodsPersistenceService) {}

  async calculateNutrientsByMeasure(dto: CalculateNutrientsByMeasureDto): Promise<NutrientDetails> {
    const [food] = await this.ifps.getFoodsByUuids([dto.internalFood]);
    const measureUsed = food.measures.find((measure) => measure.uri === dto.uri);
    const amountInGrams = measureUsed.weight * dto.amount;
    const totalNutrients: NutrientDetails = {};
    this.calculateNutrients(food.nutrientDetails, totalNutrients, amountInGrams);

    return totalNutrients;
  }
  async calculateFoodsNutrients(dto: CalculateFoodsNutrientsDto): Promise<NutrientDetails> {
    const foods = await this.ifps.getFoodsByUuids(dto.internalFoods.map((food) => food.internalFood));

    const nutrientsAccumulated: NutrientDetails = {};
    for (const [_index, internalFood] of dto.internalFoods.entries()) {
      const food = foods.find((food) => food.uuid === internalFood.internalFood);
      this.calculateNutrients(food.nutrientDetails, nutrientsAccumulated, internalFood.amountInGrams);
    }

    return nutrientsAccumulated;
  }
  private calculateNutrients(
    nutrientDetails: NutrientDetails,
    nutrientsAccumulated: NutrientDetails,
    amountToCalculate: number,
  ): void {
    for (const nutrientKey in nutrientDetails) {
      const typedKey = nutrientKey as keyof NutrientDetails;
      const quantityPer100g = nutrientDetails[typedKey].quantity;
      const totalNutrient = (quantityPer100g * amountToCalculate) / this._100grams;

      if (nutrientsAccumulated[typedKey]) {
        nutrientsAccumulated[typedKey].quantity += totalNutrient;
      } else {
        nutrientsAccumulated[typedKey] = { ...nutrientDetails[typedKey], quantity: totalNutrient };
      }
    }
  }
}
