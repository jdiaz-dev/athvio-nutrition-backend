import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CustomMeal, CustomMealDocument } from 'src/modules/professionals/custom-meals/adapters/out/custom-meal.schema';
import {
  GetCustomMealsDto,
  GetCustomMealsResponse,
} from 'src/modules/professionals/custom-meals/adapters/in/dtos/get-custom-meals.dto';
import { UpdateCustomMealDto } from 'src/modules/professionals/custom-meals/adapters/in/dtos/update-custom-meal.dto';
import { DeleteCustomMealDto } from 'src/modules/professionals/custom-meals/adapters/in/dtos/delete-custom-meal.dto';
import { ErrorCustomMealEnum } from 'src/shared/enums/messages-response';
import { CreateCustomMealDto } from 'src/modules/professionals/custom-meals/adapters/in/dtos/create-custom-meal.dto';
import { GetCustomMealDto } from 'src/modules/professionals/custom-meals/adapters/in/dtos/get-custom-meal.dto';

@Injectable()
export class CustomMealsPersistenceService {
  constructor(@InjectModel(CustomMeal.name) private readonly customMealModel: Model<CustomMealDocument>) {}

  async createCustomMeal({ professional, ...rest }: CreateCustomMealDto): Promise<CustomMeal> {
    const customMeal = await this.customMealModel.create({
      professional,
      ...rest,
    });
    return customMeal;
  }
  async getCustomMeal({ professional, ...rest }: GetCustomMealDto, selectors: any[]): Promise<CustomMeal> {
    const customMeal = await this.customMealModel.findOne(
      {
        _id: rest.customMeal,
        professional,
        isDeleted: false,
      },
      selectors,
    );
    if (customMeal == null) throw new BadRequestException(ErrorCustomMealEnum.CUSTOM_MEAL_NOT_FOUND);

    return customMeal;
  }
  async getCustomMeals(
    { professional, ...rest }: GetCustomMealsDto,
    selectors: Object,
  ): Promise<GetCustomMealsResponse> {
    const customMeals = await this.customMealModel.aggregate([
      {
        $match: {
          professional: new Types.ObjectId(professional),
          isDeleted: false,
        },
      },
      {
        $facet: {
          data: [
            {
              $skip: rest.offset,
            },
            {
              $limit: rest.limit,
            },
            {
              $project: selectors,
            },
          ],
          meta: [{ $count: 'total' }],
        },
      },
      {
        $project: {
          data: 1,
          total: { $arrayElemAt: ['$meta.total', 0] },
        },
      },
    ]);

    const res: GetCustomMealsResponse = {
      data: customMeals[0].data,
      meta: {
        total: customMeals[0].total ? customMeals[0].total : 0,
        limit: rest.limit,
        offset: rest.offset,
      },
    };

    return res;
  }
  async updateCustomMeal({ professional, customMeal, ...rest }: UpdateCustomMealDto): Promise<CustomMeal> {
    const customMealRes = await this.customMealModel.findOneAndUpdate(
      { _id: customMeal, professional, isDeleted: false },
      { ...rest },
      { new: true },
    );

    if (customMeal == null) throw new BadRequestException(ErrorCustomMealEnum.CUSTOM_MEAL_NOT_FOUND);
    return customMealRes;
  }

  async deleteCustomMeal({ professional, ...rest }: DeleteCustomMealDto): Promise<CustomMeal> {
    const customMeal = await this.customMealModel.findOneAndUpdate(
      {
        _id: rest.customMeal,
        professional: professional,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        new: true,
      },
    );

    if (customMeal == null) throw new BadRequestException(ErrorCustomMealEnum.CUSTOM_MEAL_NOT_FOUND);

    return customMeal;
  }
}
