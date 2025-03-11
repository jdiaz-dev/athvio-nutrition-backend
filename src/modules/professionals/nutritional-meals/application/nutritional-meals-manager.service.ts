import { Injectable } from '@nestjs/common';

import { NutritionalMeal } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';
import { CreateNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/dtos/create-nutritional-meal.dto';
import { NutritionalMealsPersistenceService } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meals-persistence.service';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';
import {
  GetNutritionalMealsDto,
  GetNutritionalMealsResponse,
} from 'src/modules/professionals/nutritional-meals/adapters/in/dtos/get-nutritional-meals.dto';
import { NutritionalMealDatabases } from 'src/modules/professionals/nutritional-meals/helpers/constants';
import { EnumMealOwner } from 'src/shared/enums/project';

@Injectable()
export class NutritionalMealsManagerService {
  constructor(private pps: ProfessionalsPersistenceService, private crps: NutritionalMealsPersistenceService) {}

  async getNutritionalMeals(
    { database, ...rest }: GetNutritionalMealsDto,
    selectors: Record<string, number>,
  ): Promise<GetNutritionalMealsResponse> {
    const sourceQuery =
      database === NutritionalMealDatabases.ALL
        ? { $or: [{ owner: { $eq: EnumMealOwner.PROFESSIONAL } }, { owner: { $eq: EnumMealOwner.SYSTEM } }] }
        : database === NutritionalMealDatabases.CUSTOM_RECIPES
        ? { owner: EnumMealOwner.PROFESSIONAL }
        : { owner: EnumMealOwner.SYSTEM };
    const nutritionalMeals = await this.crps.getNutritionalMeals({ ...rest, sourceQuery }, selectors);
    return nutritionalMeals;
  }
  async createNutritionalMeal(dto: CreateNutritionalMealDto): Promise<NutritionalMeal> {
    await this.pps.getProfessionalById(dto.professional, { _id: 1 });
    const nutritionalMeal = await this.crps.createNutritionalMeal(dto);
    return nutritionalMeal;
  }
}
