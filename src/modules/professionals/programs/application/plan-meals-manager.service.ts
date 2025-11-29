import { Injectable } from '@nestjs/common';
import { Program } from 'src/modules/professionals/programs/adapters/out/program.schema';

import { MealsPersistenceService } from 'src/modules/professionals/programs/adapters/out/meals-persistence.service';
import { AddMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/add-meal.dto';
import { UpdateMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/update-meal.dto';
import { DeleteMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/delete-meal.dto';
import { MealImagesManagerService } from 'src/shared/services/meal-images-manager.service';

@Injectable()
export class PlanMealsManagerService {
  constructor(
    private readonly mps: MealsPersistenceService,
    private readonly mims: MealImagesManagerService,
  ) {}

  async addMeal({ meals, ...restDto }: AddMealDto, selectors: Record<string, number>): Promise<Program> {
    const imageMealsProcessed = await this.mims.processImageMeals(meals);
    const plan = await this.mps.addMeal({ ...restDto, meals: imageMealsProcessed }, selectors);

    return plan;
  }

  async updateMeal({ meals, ...rest }: UpdateMealDto, selectors: Record<string, number>): Promise<Program> {
    const imageMealsProcessed = await this.mims.processImageMeals(meals);
    return this.mps.updateMeal({ ...rest, meals: imageMealsProcessed }, selectors);
  }

  async deleteMeal(dto: DeleteMealDto, selectors: Record<string, number>): Promise<Program> {
    return this.mps.deleteMeal(dto, selectors);
  }
}
