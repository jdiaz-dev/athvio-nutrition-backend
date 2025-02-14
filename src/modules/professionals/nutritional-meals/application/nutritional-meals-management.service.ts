import { Injectable } from '@nestjs/common';

import { NutritionalMeal } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';
import { CreateNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/dtos/create-nutritional-meal.dto';
import { NutritionalMealsPersistenceService } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meals-persistence.service';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';

@Injectable()
export class NutritionalMealsManagementService {
  constructor(private pps: ProfessionalsPersistenceService, private crps: NutritionalMealsPersistenceService) {}

  async createNutritionalMeal(dto: CreateNutritionalMealDto): Promise<NutritionalMeal> {
    await this.pps.getProfessionalById(dto.professional, { _id: 1 });
    const nutritionalMeal = await this.crps.createNutritionalMeal(dto);
    return nutritionalMeal;
  }
}
