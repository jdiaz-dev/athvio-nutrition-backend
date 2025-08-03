import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { InternalFood, InternalFoodDocument } from 'src/modules/backoffice/foods/adapters/out/internal-food.schema';
import { GetFoods, GetInternalFoodsResponse } from 'src/modules/backoffice/foods/helpers/foods';
import { MongodbQueryBuilder } from 'src/shared/database/mongodb-query-builder';

@Injectable()
export class InternalFoodsPersistenceService extends MongodbQueryBuilder<InternalFoodDocument> {
  constructor(
    @InjectModel(InternalFood.name) protected readonly internalFoodModel: Model<InternalFoodDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(internalFoodModel, logger, InternalFood.name);
  }

  async saveInternalFoods(data: Omit<InternalFood, '_id' | 'uuid' | 'createdAt' | 'updatedAt'>[]): Promise<InternalFood[]> {
    const res = await this.initializeQuery(this.saveInternalFoods.name).insertMany(data);
    return res;
  }
  async getInternalFoods(dto: Omit<GetFoods, 'professional' | 'foodDatabase'>): Promise<GetInternalFoodsResponse> {
    const foodsRes = await this.initializeQuery(this.getInternalFoods.name).aggregate([
      {
        $match: {
          ...(dto.search[0].length > 0 && { $text: { $search: dto.search.join(' ') } }),
          'foodDetails.category': 'Generic foods',
        },
      },
      {
        $addFields: {
          isExactMatch: {
            $in: [{ $toLower: '$foodDetails.label' }, dto.search.map((word) => word.toLowerCase())],
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
  }
  async getInternalFoodsByNames(foodNames: string[]): Promise<InternalFood[]> {
    const foodsRes = await this.initializeQuery(this.getInternalFoodsByNames.name).find(
      {
        $or: foodNames.map((item) => ({ 'foodDetails.label': item })),
      },
      { 'foodDetails.label': 1, '_id': 1 },
      {
        collation: { locale: 'es', strength: 2 },
      },
    );

    return foodsRes;
  }
}
