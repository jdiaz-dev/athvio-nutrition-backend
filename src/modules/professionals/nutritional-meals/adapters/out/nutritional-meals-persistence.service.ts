import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { NutritionalMeal, NutritionalDocument } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';
import {
  GetNutritionalMealsDto,
  GetNutritionalMealsResponse,
} from 'src/modules/professionals/nutritional-meals/adapters/in/dtos/get-nutritional-meals.dto';
import { DeleteNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/dtos/delete-nutritional-meal.dto';
import { ErrorNutritionalMealEnum } from 'src/shared/enums/messages-response';
import { CreateNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/dtos/create-nutritional-meal.dto';
import { GetNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/dtos/get-nutritional-meal.dto';
import { UpdateNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/dtos/update-nutritional-meal.dto';
import { searchByFieldsGenerator } from 'src/shared/helpers/mongodb-helpers';

@Injectable()
export class NutritionalMealsPersistenceService {
  constructor(@InjectModel(NutritionalMeal.name) private readonly nutritionalMealModel: Model<NutritionalDocument>) {}

  async createNutritionalMeal({ professional, ...rest }: CreateNutritionalMealDto): Promise<NutritionalMeal> {
    const nutritionalMeal = await this.nutritionalMealModel.create({
      professional,
      ...rest,
    });

    return nutritionalMeal;
  }

  async getNutritionalMeal({ professional, ...rest }: GetNutritionalMealDto, selectors: string[]): Promise<NutritionalMeal> {
    const nutritionalMealRes = await this.nutritionalMealModel.findOne(
      {
        _id: rest.nutritionalMeal,
        professional,
        isDeleted: false,
      },
      selectors,
    );
    if (nutritionalMealRes === null) throw new BadRequestException(ErrorNutritionalMealEnum.NUTRITIONAL_PLAN_NOT_FOUND);

    return nutritionalMealRes;
  }
  async getNutritionalMeals(
    { professional, ...rest }: GetNutritionalMealsDto,
    selectors: Record<string, number>,
  ): Promise<GetNutritionalMealsResponse> {
    const fieldsToSearch = searchByFieldsGenerator(['name'], rest.search);

    const nutritionalMeals = await this.nutritionalMealModel.aggregate([
      {
        $match: {
          professional: new Types.ObjectId(professional),
          isDeleted: false,
        },
      },
      {
        $match: {
          $or: fieldsToSearch,
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

    const res: GetNutritionalMealsResponse = {
      data: nutritionalMeals[0].data,
      meta: {
        total: nutritionalMeals[0].total ? nutritionalMeals[0].total : 0,
        limit: rest.limit,
        offset: rest.offset,
      },
    };

    return res;
  }
  async updateNutritionalMeal({ professional, nutritionalMeal, ...rest }: UpdateNutritionalMealDto): Promise<NutritionalMeal> {
    const nutritionalMealRes = await this.nutritionalMealModel.findOneAndUpdate(
      { _id: new Types.ObjectId(nutritionalMeal), professional: new Types.ObjectId(professional), isDeleted: false },
      { ...rest },
      { new: true },
    );
    if (nutritionalMealRes === null) throw new BadRequestException(ErrorNutritionalMealEnum.NUTRITIONAL_PLAN_NOT_FOUND);
    return nutritionalMealRes;
  }

  async deleteNutritionalMeal({ professional, ...rest }: DeleteNutritionalMealDto): Promise<NutritionalMeal> {
    const nutritionalMealRes = await this.nutritionalMealModel.findOneAndUpdate(
      {
        _id: rest.nutritionalMeal,
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

    if (nutritionalMealRes === null) throw new BadRequestException(ErrorNutritionalMealEnum.NUTRITIONAL_PLAN_NOT_FOUND);

    return nutritionalMealRes;
  }
}
