import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CustomMeal, CustomMealDocument } from 'src/modules/professionals/custom-meals/adapters/out/custom-meal.schema';
import { GetCustomMealsDto } from 'src/modules/professionals/custom-meals/adapters/in/dtos/get-custom-meals.dto';
import { UpdateCustomMealDto } from 'src/modules/professionals/custom-meals/adapters/in/dtos/update-custom-meal.dto';
import { DeleteCustomMealDto } from 'src/modules/professionals/custom-meals/adapters/in/dtos/delete-custom-meal.dto';
import { ErrorCustomMealEnum } from 'src/shared/enums/messages-response';
import { CreateCustomMealDto } from 'src/modules/professionals/custom-meals/adapters/in/dtos/create-custom-meal.dto';
import { GetCustomMealDto } from 'src/modules/professionals/custom-meals/adapters/in/dtos/get-custom-meal.dto';

@Injectable()
export class CustomMealsPersistenceService {
  constructor(@InjectModel(CustomMeal.name) private readonly customMealModel: Model<CustomMealDocument>) {}

  async createCustomMeal({ professionalId, ...rest }: CreateCustomMealDto): Promise<CustomMeal> {
    const customMeal = await this.customMealModel.create({
      professionalId,
      ...rest,
    });
    return customMeal;
  }
  async getCustomMeal({ professionalId, ...rest }: GetCustomMealDto, selectors: any[]): Promise<CustomMeal> {
    const customMeal = await this.customMealModel.findOne(
      {
        _id: rest.customMealId,
        professionalId,
        isDeleted: false,
      },
      selectors,
    );
    if (customMeal == null) throw new BadRequestException(ErrorCustomMealEnum.CUSTOM_MEAL_NOT_FOUND);

    return customMeal;
  }
  async getCustomMeals({ professionalId, ...rest }: GetCustomMealsDto, selectors: any[]): Promise<CustomMeal[]> {
    const customMeals = await this.customMealModel.find(
      {
        professionalId,
        isDeleted: false,
      },
      selectors,
      {
        limit: rest.limit,
        skip: rest.offset,
        sort: rest.orderBy,
      },
    );
    return customMeals;
  }
  async updateCustomMeal({ professionalId, customMealId, ...rest }: UpdateCustomMealDto): Promise<CustomMeal> {
    const customMeal = await this.customMealModel.findOneAndUpdate(
      { _id: customMealId, professionalId, isDeleted: false },
      { ...rest },
      { new: true },
    );

    if (customMeal == null) throw new BadRequestException(ErrorCustomMealEnum.CUSTOM_MEAL_NOT_FOUND);
    return customMeal;
  }

  async deleteCustomMeal(rest: DeleteCustomMealDto, professionalId: string): Promise<CustomMeal> {
    const customMeal = await this.customMealModel.findOneAndUpdate({
      _id: rest.customMealId,
      professionalId,
      isDeleted: true,
    });

    if (customMeal == null) throw new BadRequestException(ErrorCustomMealEnum.CUSTOM_MEAL_NOT_FOUND);

    return customMeal;
  }
}
