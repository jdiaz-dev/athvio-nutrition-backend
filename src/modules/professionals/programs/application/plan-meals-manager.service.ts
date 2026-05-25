import { BadRequestException, Injectable } from '@nestjs/common';
import { Program } from 'src/modules/professionals/programs/adapters/out/program.schema';

import { MealsPersistenceService } from 'src/modules/professionals/programs/adapters/out/meals-persistence.service';
import { AddMealDto } from 'src/modules/professionals/programs/adapters/in/web/dtos/meal/add-meal.dto';
import { UpdateMealDto } from 'src/modules/professionals/programs/adapters/in/web/dtos/meal/update-meal.dto';
import { DeleteMealDto } from 'src/modules/professionals/programs/adapters/in/web/dtos/meal/delete-meal.dto';
import { MealImagesManagerService } from 'src/shared/application/meal-images-manager.service';
import { ErrorProgramEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class PlanMealsManagerService {
  constructor(
    private readonly mps: MealsPersistenceService,
    private readonly mims: MealImagesManagerService,
  ) {}

  async addMeal({ meals, ...restDto }: AddMealDto, selectors: Record<string, number>): Promise<Program> {
    const imageMealsProcessed = await this.mims.processImageMeals(meals);
    const program = await this.mps.addMeal({ ...restDto, meals: imageMealsProcessed }, selectors);
    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return program;
  }

  async updateMeal({ meals, ...rest }: UpdateMealDto, selectors: Record<string, number>): Promise<Program> {
    const imageMealsProcessed = await this.mims.processImageMeals(meals);
    const program = await this.mps.updateMeal({ ...rest, meals: imageMealsProcessed }, selectors);
    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return program;
  }

  async deleteMeal(dto: DeleteMealDto, selectors: Record<string, number>): Promise<Program> {
    const program = await this.mps.deleteMeal(dto, selectors);
    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return program;
  }
}
