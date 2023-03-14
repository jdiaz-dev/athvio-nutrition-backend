import { Injectable } from '@nestjs/common';

import { CustomMeal } from 'src/modules/professionals/custom-meals/adapters/out/custom-meal.schema';
import { CreateCustomMealDto } from 'src/modules/professionals/custom-meals/adapters/in/dtos/create-custom-meal.dto';
import { CustomMealsPersistenceService } from 'src/modules/professionals/custom-meals/adapters/out/custom-meals-persistence.service';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';

@Injectable()
export class CustomMealsManagementService {
  constructor(private pms: ProfessionalsManagementService, private cmps: CustomMealsPersistenceService) {}

  async createCustomMeal(dto: CreateCustomMealDto): Promise<CustomMeal> {
    await this.pms.getProfessionalById(dto.professionalId);
    const customMeal = await this.cmps.createCustomMeal(dto);
    return customMeal;
  }
}
