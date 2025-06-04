import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  NutritionalMeal,
  NutritionalDocument,
} from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';
import { GetNutritionalMealsResponse } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/get-nutritional-meals-for-professional.dto';
import { DeleteNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/delete-nutritional-meal.dto';
import { CreateNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/create-nutritional-meal.dto';
import { GetNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/get-nutritional-meal.dto';
import { UpdateNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/update-nutritional-meal.dto';
import { searchByFieldsGenerator } from 'src/shared/helpers/mongodb-helpers';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { EnumSources } from 'src/shared/enums/project';
import { MongodbQueryBuilder } from 'src/shared/database/mongodb-query-builder';

@Injectable()
export class NutritionalMealsPersistenceService extends MongodbQueryBuilder<NutritionalDocument> {
  constructor(
    @InjectModel(NutritionalMeal.name) protected readonly nutritionalMealModel: Model<NutritionalDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(nutritionalMealModel, logger, NutritionalMeal.name);
  }

  async createNutritionalMeal({ professional, ...rest }: CreateNutritionalMealDto): Promise<NutritionalMeal> {
    const nutritionalMeal = await this.startQuery(this.createNutritionalMeal.name).create({
      professional,
      ...rest,
    });

    return nutritionalMeal;
  }

  async getNutritionalMeal(
    { professional, nutritionalMeal }: Omit<GetNutritionalMealDto, 'professional'> & { professional?: string },
    selectors: Record<string, number>,
  ): Promise<NutritionalMeal> {
    const nutritionalMealRes = await this.startQuery(this.getNutritionalMeal.name).findOne(
      {
        _id: nutritionalMeal,
        ...(professional && { professional }),
        isDeleted: false,
      },
      selectors,
    );

    return nutritionalMealRes;
  }
  async getNutritionalMeals(
    { match, ...rest }: GetRecordsBaseDto & { match?: { [k: string]: unknown } },
    selectors: Record<string, number>,
  ): Promise<GetNutritionalMealsResponse> {
    const fieldsToSearch = searchByFieldsGenerator(['name'], rest.search);

    const nutritionalMeals = await this.startQuery(this.getNutritionalMeals.name).aggregate([
      {
        $match: {
          ...match,
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
  async updateNutritionalMeal({
    professional,
    nutritionalMeal,
    source,
    ...rest
  }: Omit<Partial<UpdateNutritionalMealDto>, 'professional' | 'source' | 'image'> & {
    professional?: string;
    source?: EnumSources;
    image?: string;
  }): Promise<NutritionalMeal> {
    const nutritionalMealRes = await this.startQuery(this.updateNutritionalMeal.name).findOneAndUpdate(
      {
        _id: new Types.ObjectId(nutritionalMeal),
        ...(professional && { professional }),
        ...(source && { source }),
        isDeleted: false,
      },
      { ...rest },
      { new: true },
    );
    return nutritionalMealRes;
  }

  async deleteNutritionalMeal({ professional, ...rest }: DeleteNutritionalMealDto): Promise<NutritionalMeal> {
    const nutritionalMealRes = await this.startQuery(this.deleteNutritionalMeal.name).findOneAndUpdate(
      {
        _id: rest.nutritionalMeal,
        professional,
        source: EnumSources.PROFESSIONAL,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        new: true,
      },
    );

    return nutritionalMealRes;
  }
}
