import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { NutrientsCalculatorService } from 'src/modules/nutrition/foods/application/nutrients-calculator.service';
import { CalculateNutrientsDto } from 'src/modules/nutrition/foods/adapters/in/dtos/calculate-nutrients.dto';
import { NutrientDetails } from 'src/shared/adapters/out/schemas/internal-food.schema';

@Resolver()
export class CalculatorResolver {
  constructor(private readonly ncs: NutrientsCalculatorService) {}

  @Mutation(() => NutrientDetails)
  async calculateNutrients(@Args('input') dto: CalculateNutrientsDto): Promise<NutrientDetails> {
    const result = await this.ncs.calculateNutrients(dto);
    return result;
  }
}
