import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CustomMeal, CustomMealDocument } from 'src/modules/users/custom-meals/adapters/out/custom-meal.schema';
import { GetCustomMealDto } from 'src/modules/users/custom-meals/adapters/in/dtos/get-custom-meal.dto';
import { GetCustomMealsDto } from 'src/modules/users/custom-meals/adapters/in/dtos/get-custom-meals.dto';
import { UpdateCustomMealDto } from 'src/modules/users/custom-meals/adapters/in/dtos/update-custom-meal.dto';
import { DeleteCustomMealDto } from 'src/modules/users/custom-meals/adapters/in/dtos/delete-custom-meal.dto';
import { ErrorCustomMealEnum } from 'src/shared/enums/messages-response';
import { CreateCustomMealDto } from 'src/modules/users/custom-meals/adapters/in/dtos/create-custom-meal.dto';

@Injectable()
export class CustomMealsPersistenceService {
  constructor(@InjectModel(CustomMeal.name) private readonly customMealModel: Model<CustomMealDocument>) {}

  async createCustomMeal(dto: CreateCustomMealDto, userId: string): Promise<CustomMeal> {
    const customMeal = await this.customMealModel.create({
      userId,
      ...dto,
    });
    return customMeal;
  }
  async getCustomMeal(dto: GetCustomMealDto, userId: string, selectors: any[]): Promise<CustomMeal> {
    const customMeal = await this.customMealModel.findOne(
      {
        _id: dto.customMealId,
        userId,
        isDeleted: false,
      },
      selectors,
    );
    return customMeal;
  }
  async getCustomMeals(dto: GetCustomMealsDto, userId: string, selectors: any[]): Promise<CustomMeal[]> {
    const customMeals = await this.customMealModel.find(
      {
        userId,
        isDeleted: false,
      },
      selectors,
      {
        limit: dto.limit,
        skip: dto.offset,
        sort: dto.orderBy,
      },
    );
    return customMeals;
  }
  async updateCustomMeal({ customMealId, ...rest }: UpdateCustomMealDto, userId: string): Promise<CustomMeal> {
    const customMeal = await this.customMealModel.findOneAndUpdate(
      { _id: customMealId, userId, isDeleted: false },
      { ...rest },
      { new: true },
    );

    if (customMeal == null) throw new BadRequestException(ErrorCustomMealEnum.CUSTOM_MEAL_NOT_FOUND);
    return customMeal;
  }

  async deleteCustomMeal(dto: DeleteCustomMealDto, userId: string): Promise<CustomMeal> {
    const customMeal = await this.customMealModel.findOneAndUpdate({
      _id: dto.customMealId,
      userId,
      isDeleted: true,
    });

    if (customMeal == null) throw new BadRequestException(ErrorCustomMealEnum.CUSTOM_MEAL_NOT_FOUND);

    return customMeal;
  }
}
