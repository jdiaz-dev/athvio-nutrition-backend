import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AsyncLocalStorage } from 'node:async_hooks';

import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { InternalFood, InternalFoodDocument } from 'src/shared/adapters/out/schemas/internal-food.schema';
import { GetFoods, GetInternalFoodsResponse } from 'src/modules/nutrition/foods/helpers/foods';
import { MongodbQueryBuilder } from 'src/shared/adapters/out/database/mongodb-query-builder';
import { Trazability } from 'src/shared/types';

@Injectable()
export class InternalFoodsPersistenceService extends MongodbQueryBuilder<InternalFoodDocument> {
  constructor(
    @InjectModel(InternalFood.name) protected readonly internalFoodModel: Model<InternalFoodDocument>,
    protected readonly logger: AthvioLoggerService,
    protected readonly als: AsyncLocalStorage<Trazability>,
  ) {
    super(internalFoodModel, logger, InternalFood.name, als);
  }
  async saveInternalFoods(data: Omit<InternalFood, '_id' | 'createdAt' | 'updatedAt'>[]): Promise<InternalFood[]> {
    const res = await this.initializeQuery(this.saveInternalFoods.name).insertMany(data);
    return res;
  }
  async getFoodsByUuids(uuids: string[]): Promise<InternalFood[]> {
    const foodsRes = await this.initializeQuery(this.getFoodsByUuids.name).aggregate([
      {
        $match: {
          uuid: { $in: uuids },
        },
      },
      {
        $addFields: {
          __order: {
            $indexOfArray: [{ $literal: uuids }, '$uuid'],
          },
        },
      },
      { $sort: { __order: 1 } },
      { $project: { __order: 0 } },
    ]);

    return foodsRes as InternalFood[];
  }

  async getInternalFoods(dto: Omit<GetFoods, 'professional' | 'foodDatabase'>): Promise<GetInternalFoodsResponse> {
    const hasSearch = Array.isArray(dto.search) && dto.search.join(' ').trim().length > 0;

    const foodsRes = await this.initializeQuery(this.getInternalFoods.name).aggregate([
      {
        $match: {
          ...(hasSearch && { $text: { $search: dto.search.join(' ') } }),
          'foodDetails.category': 'Generic foods',
        },
      },
      {
        $addFields: {
          ...(hasSearch && { score: { $meta: 'textScore' } }),
        },
      },
      {
        $sort: {
          score: -1,
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
