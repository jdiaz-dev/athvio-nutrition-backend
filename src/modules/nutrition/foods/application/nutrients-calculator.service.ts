import { Injectable } from '@nestjs/common';
import { CalculateNutrientsDto } from 'src/modules/nutrition/foods/adapters/in/dtos/calculate-nutrients.dto';
import { InternalFoodsPersistenceService } from 'src/modules/nutrition/foods/adapters/out/internal-foods-persistence.service';
import { NutrientDetails } from 'src/shared/adapters/out/schemas/internal-food.schema';

@Injectable()
export class NutrientsCalculatorService {
  constructor(private readonly ifps: InternalFoodsPersistenceService) {}

  async calculateNutrients(dto: CalculateNutrientsDto): Promise<NutrientDetails> {
    const calculatedNutrients = await this.ifps.getTotalNutrientsByUuids(dto);
    return calculatedNutrients;
  }
}
