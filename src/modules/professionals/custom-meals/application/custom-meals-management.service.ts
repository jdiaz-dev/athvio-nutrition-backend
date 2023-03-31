import { Injectable } from '@nestjs/common';

import { CustomMeal } from 'src/modules/professionals/custom-meals/adapters/out/custom-meal.schema';
import { CreateCustomMealDto } from 'src/modules/professionals/custom-meals/adapters/in/dtos/create-custom-meal.dto';
import { CustomMealsPersistenceService } from 'src/modules/professionals/custom-meals/adapters/out/custom-meals-persistence.service';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';

@Injectable()
export class CustomMealsManagementService {
  constructor(private pps: ProfessionalsPersistenceService, private cmps: CustomMealsPersistenceService) {}

  async createCustomMeal(dto: CreateCustomMealDto): Promise<CustomMeal> {
    await this.pps.getProfessionalById(dto.professional);
    const customMeal = await this.cmps.createCustomMeal(dto);
    return customMeal;
  }
}
