import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  NutritionalMeal,
  NutritionalDocument,
} from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';
import { GetNutritionalMealsResponse } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/get-nutritional-meals-for-professional.dto';
import { DeleteNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/delete-nutritional-meal.dto';
import { InternalErrors } from 'src/shared/enums/messages-response';
import { CreateNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/create-nutritional-meal.dto';
import { GetNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/get-nutritional-meal.dto';
import { UpdateNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/update-nutritional-meal.dto';
import { searchByFieldsGenerator } from 'src/shared/helpers/mongodb-helpers';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { EnumMealSources, LayersServer } from 'src/shared/enums/project';

@Injectable()
export class NutritionalMealsPersistenceService {
  constructor(
    @InjectModel(NutritionalMeal.name) private readonly nutritionalMealModel: Model<NutritionalDocument>,
    private readonly logger: AthvioLoggerService,
  ) {}

  async createNutritionalMeal({ professional, ...rest }: CreateNutritionalMealDto): Promise<NutritionalMeal> {
    try {
      const nutritionalMeal = await this.nutritionalMealModel.create({
        professional,
        ...rest,
      });

      return nutritionalMeal;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, message: (error as Error).message, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }

  async getNutritionalMeal(
    { professional, nutritionalMeal }: Omit<GetNutritionalMealDto, 'professional'> & { professional?: string },
    selectors: string[],
  ): Promise<NutritionalMeal> {
    try {
      const nutritionalMealRes = await this.nutritionalMealModel.findOne(
        {
          _id: nutritionalMeal,
          ...(professional && { professional }),
          isDeleted: false,
        },
        selectors,
      );

      return nutritionalMealRes;
    } catch (error: unknown) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, message: (error as Error).message, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async getNutritionalMeals(
    { match, ...rest }: GetRecordsBaseDto & { match?: { [k: string]: unknown } },
    selectors: Record<string, number>,
  ): Promise<GetNutritionalMealsResponse> {
    try {
      const fieldsToSearch = searchByFieldsGenerator(['name'], rest.search);

      const nutritionalMeals = await this.nutritionalMealModel.aggregate([
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
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, message: (error as Error).message, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async updateNutritionalMeal({
    professional,
    nutritionalMeal,
    source,
    ...rest
  }: Omit<Partial<UpdateNutritionalMealDto>, 'professional' | 'source' | 'image'> & {
    professional?: string;
    source?: EnumMealSources;
    image?: string;
  }): Promise<NutritionalMeal> {
    try {
      const nutritionalMealRes = await this.nutritionalMealModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(nutritionalMeal),
          ...(professional && { professional: new Types.ObjectId(professional) }),
          ...(source && { source }),
          isDeleted: false,
        },
        { ...rest },
        { new: true },
      );
      return nutritionalMealRes;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, message: (error as Error).message, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }

  async deleteNutritionalMeal({ professional, ...rest }: DeleteNutritionalMealDto): Promise<NutritionalMeal> {
    try {
      const nutritionalMealRes = await this.nutritionalMealModel.findOneAndUpdate(
        {
          _id: rest.nutritionalMeal,
          professional: professional,
          source: EnumMealSources.PROFESSIONAL,
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
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, message: (error as Error).message, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
}
