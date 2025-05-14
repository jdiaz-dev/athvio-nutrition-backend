import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InternalErrors } from 'src/shared/enums/messages-response';

import { LayersServer } from 'src/shared/enums/project';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { InternalFood, InternalFoodDocument } from 'src/modules/program-generator/foods/adapters/out/internal-food.schema';
import { searchByFieldsGenerator } from 'src/shared/helpers/mongodb-helpers';
import { GetFoods, GetInternalFoodsResponse } from 'src/modules/program-generator/foods/helpers/foods';

@Injectable()
export class InternalFoodsPersistenceService {
  constructor(
    @InjectModel(InternalFood.name) private readonly internalFoodModel: Model<InternalFoodDocument>,
    private readonly logger: AthvioLoggerService,
  ) {}

  async saveInternalFoods(data: Omit<InternalFood, '_id' | 'createdAt' | 'updatedAt'>[]): Promise<InternalFood[]> {
    try {
      const res = await this.internalFoodModel.insertMany(data);
      return res;
    } catch (error: unknown) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error, message: (error as Error).message });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async getInternalFoods(dto: Omit<GetFoods, 'professional' | 'foodDatabase'>): Promise<GetInternalFoodsResponse> {
    const combinedFields = searchByFieldsGenerator(['foodDetails.label'], dto.search);
    try {
      const foodsRes = await this.internalFoodModel.aggregate([
        {
          $match: {
            $or: combinedFields,
          },
        },
        {
          $addFields: {
            isExactMatch: {
              $eq: [{ $toLower: '$foodDetails.label' }, dto.search[0].toLowerCase()],
            },
          },
        },
        {
          $sort: {
            'isExactMatch': -1,
            'foodDetails.label': 1,
          },
        },
        {
          $project: {
            isExactMatch: 0,
          },
        },
        {
          $facet: {
            data: [
              {
                $skip: dto.offset,
              },
              {
                $limit: dto.limit,
              },
            ],
            meta: [{ $count: 'total' }],
          },
        },
        {
          $project: {
            data: 1,
            total: { $ifNull: [{ $arrayElemAt: ['$meta.total', 0] }, 0] },
          },
        },
      ]);
      const res: GetInternalFoodsResponse = {
        data: foodsRes[0].data,
        meta: {
          total: foodsRes[0].total,
          limit: dto.limit,
          offset: dto.offset,
        },
      };

      return res;
    } catch (error: unknown) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error, message: (error as Error).message });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async getInternalFoodsByNames(foodNames: string[]): Promise<InternalFood[]> {
    try {
      const foodsRes = await this.internalFoodModel.find(
        {
          $or: foodNames.map((item) => ({ 'foodDetails.label': item })),
        },
        { 'foodDetails.label': 1, '_id': 1 },
        {
          collation: { locale: 'es', strength: 2 },
        },
      );

      return foodsRes;
    } catch (error: unknown) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error, message: (error as Error).message });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
}
