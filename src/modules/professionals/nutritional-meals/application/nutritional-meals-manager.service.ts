import { Injectable } from '@nestjs/common';

import { NutritionalMeal } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';
import { CreateNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/create-nutritional-meal.dto';
import { NutritionalMealsPersistenceService } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meals-persistence.service';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';
import {
  GetNutritionalMealsForProfessionalDto,
  GetNutritionalMealsResponse,
} from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/get-nutritional-meals-for-professional.dto';
import { NutritionalMealDatabases } from 'src/modules/professionals/nutritional-meals/helpers/constants';
import { EnumMealOwner } from 'src/shared/enums/project';
import { GetNutritionalMealsForPatientDto } from 'src/modules/professionals/nutritional-meals/adapters/in/mobile/dtos/get-nutritional-meals-for-patient.dto';

@Injectable()
export class NutritionalMealsManagerService {
  constructor(private pps: ProfessionalsPersistenceService, private crps: NutritionalMealsPersistenceService) {}

  async getNutritionalMealsForProfessional(
    { database, professional, ...rest }: GetNutritionalMealsForProfessionalDto,
    selectors: Record<string, number>,
  ): Promise<GetNutritionalMealsResponse> {
    const sourceMealsQuery =
      database === NutritionalMealDatabases.ALL
        ? { $or: [{ owner: { $eq: EnumMealOwner.PROFESSIONAL } }, { owner: { $eq: EnumMealOwner.SYSTEM } }] }
        : database === NutritionalMealDatabases.CUSTOM_RECIPES
        ? { owner: EnumMealOwner.PROFESSIONAL }
        : { owner: EnumMealOwner.SYSTEM };
    const filters = {
      match: {
        professional,
        ...sourceMealsQuery,
      },
      ...rest,
    };
    const nutritionalMeals = await this.crps.getNutritionalMeals(filters, selectors);
    return nutritionalMeals;
  }
  async getNutritionalMealsForPatient(
    { patient, ...rest }: GetNutritionalMealsForPatientDto,
    selectors: Record<string, number>,
  ): Promise<GetNutritionalMealsResponse> {
    const nutritionalMeals = await this.crps.getNutritionalMeals({ ...rest }, selectors);
    return nutritionalMeals;
  }
  async createNutritionalMeal(dto: CreateNutritionalMealDto): Promise<NutritionalMeal> {
    await this.pps.getProfessionalById(dto.professional, { _id: 1 });
    const nutritionalMeal = await this.crps.createNutritionalMeal(dto);
    return nutritionalMeal;
  }
}
