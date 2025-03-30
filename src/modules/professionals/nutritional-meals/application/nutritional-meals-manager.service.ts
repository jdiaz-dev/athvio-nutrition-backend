import { BadRequestException, Injectable } from '@nestjs/common';

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
import { GetNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/get-nutritional-meal.dto';
import { ErrorNutritionalMealEnum } from 'src/shared/enums/messages-response';
import { UpdateNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/update-nutritional-meal.dto';
import { DeleteNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/delete-nutritional-meal.dto';

@Injectable()
export class NutritionalMealsManagerService {
  constructor(private readonly pps: ProfessionalsPersistenceService, private readonly nmps: NutritionalMealsPersistenceService) {}

  async createNutritionalMeal(dto: CreateNutritionalMealDto): Promise<NutritionalMeal> {
    await this.pps.getProfessionalById(dto.professional, { _id: 1 });
    const nutritionalMeal = await this.nmps.createNutritionalMeal(dto);
    return nutritionalMeal;
  }
  async getNutritionalMealsForProfessional(
    { database, professional, ...rest }: GetNutritionalMealsForProfessionalDto,
    selectors: Record<string, number>,
  ): Promise<GetNutritionalMealsResponse> {
    const sourceMealsQuery =
      database === NutritionalMealDatabases.ALL
        ? { $or: [{ owner: { $eq: EnumMealOwner.PROFESSIONAL } }, { owner: { $eq: EnumMealOwner.SYSTEM } }] }
        : database === NutritionalMealDatabases.CUSTOM_MEALS
        ? { owner: EnumMealOwner.PROFESSIONAL }
        : { owner: EnumMealOwner.SYSTEM };
    const filters = {
      match: {
        professional,
        ...sourceMealsQuery,
      },
      ...rest,
    };
    const nutritionalMeals = await this.nmps.getNutritionalMeals(filters, selectors);
    return nutritionalMeals;
  }
  async getNutritionalMealsForPatient(
    { patient, category, ...rest }: GetNutritionalMealsForPatientDto,
    selectors: Record<string, number>,
  ): Promise<GetNutritionalMealsResponse> {
    const nutritionalMeals = await this.nmps.getNutritionalMeals({ ...rest, match: { category } }, selectors);
    return nutritionalMeals;
  }
  async getNutritionalMeal(dto: GetNutritionalMealDto, selectors: string[]) {
    const nutritionalMealRes = await this.nmps.getNutritionalMeal(dto, selectors);
    if (nutritionalMealRes === null) throw new BadRequestException(ErrorNutritionalMealEnum.NUTRITIONAL_PLAN_NOT_FOUND);

    return nutritionalMealRes;
  }
  async updateNutritionalMeal(dto: UpdateNutritionalMealDto): Promise<NutritionalMeal> {
    const nutritionalMealRes = await this.nmps.updateNutritionalMeal(dto);
    if (nutritionalMealRes === null) throw new BadRequestException(ErrorNutritionalMealEnum.NUTRITIONAL_PLAN_NOT_FOUND);
    return nutritionalMealRes;
  }
  async deleteNutritionalMeal(dto: DeleteNutritionalMealDto): Promise<NutritionalMeal> {
    const nutritionalMealRes = await this.nmps.deleteNutritionalMeal(dto);
    if (nutritionalMealRes === null) throw new BadRequestException(ErrorNutritionalMealEnum.NUTRITIONAL_PLAN_NOT_FOUND);
    return nutritionalMealRes;
  }
}
