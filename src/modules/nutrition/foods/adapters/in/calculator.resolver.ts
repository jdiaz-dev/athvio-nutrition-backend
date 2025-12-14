import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { NutrientsCalculatorService } from 'src/modules/nutrition/foods/application/nutrients-calculator.service';
import { CalculateFoodsNutrientsDto } from 'src/modules/nutrition/foods/adapters/in/dtos/calculate-foods-nutrients.dto';
import { NutrientDetails } from 'src/shared/adapters/out/schemas/internal-food.schema';
import { CalculateNutrientsByMeasureDto } from 'src/modules/nutrition/foods/adapters/in/dtos/calculate-food-nutrients.dto';

@Resolver()
export class CalculatorResolver {
  constructor(private readonly ncs: NutrientsCalculatorService) {}

  @Mutation(() => NutrientDetails)
  async calculateNutrientsByMeasure(@Args('input') dto: CalculateNutrientsByMeasureDto): Promise<NutrientDetails> {
    return this.ncs.calculateNutrientsByMeasure(dto);
  }
  @Mutation(() => NutrientDetails)
  async calculateFoodsNutrients(@Args('input') dto: CalculateFoodsNutrientsDto): Promise<NutrientDetails> {
    return this.ncs.calculateFoodsNutrients(dto);
  }
}
