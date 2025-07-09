import { Injectable } from '@nestjs/common';
import { Program } from 'src/modules/professionals/programs/adapters/out/program.schema';

import { MealsPersistenceService } from 'src/modules/professionals/programs/adapters/out/meals-persistence.service';
import { AddMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/add-meal.dto';
import { UpdateMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/update-meal.dto';
import { DeleteMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/delete-meal.dto';
import { randomUUID } from 'node:crypto';

@Injectable()
export class PlanMealsManagerService {
  constructor(private readonly mps: MealsPersistenceService) {}

  async addMeal({ meals, ...restDto }: AddMealDto, selectors: Record<string, number>): Promise<Program> {
    return this.mps.addMeal({ ...restDto, meals: meals.map((item) => ({ uuid: randomUUID(), ...item })) }, selectors);
  }

  async updateMeal(dto: UpdateMealDto, selectors: Record<string, number>): Promise<Program> {
    return this.mps.updateMeal(dto, selectors);
  }

  async deleteMeal(dto: DeleteMealDto, selectors: Record<string, number>): Promise<Program> {
    return this.mps.deleteMeal(dto, selectors);
  }
}
