import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetFoodsDto, GetFoodsResponse } from 'src/modules/foods/adapters/in/dtos/get-foods.dto';
import { Food, FoodDocument } from 'src/modules/foods/adapters/out/food.schema';
import { searchByFieldsGenerator } from 'src/shared/helpers/mongodb-helpers';

@Injectable()
export class FoodsPersistenceService {
  constructor(@InjectModel(Food.name) private readonly foodModel: Model<FoodDocument>) {}

  async getFoods({ limit, offset, search }: GetFoodsDto): Promise<GetFoodsResponse> {
    const fieldToSearch = searchByFieldsGenerator(['name'], search);
    const foods = await this.foodModel.aggregate([
      {
        $facet: {
          data: [
            {
              $match: {
                $or: fieldToSearch,
              },
            },
            {
              $limit: limit,
            },
            {
              $skip: offset,
            },
          ],
          meta: [
            {
              $match: {
                $or: fieldToSearch,
              },
            },
            { $count: 'total' },
          ],
        },
      },
      {
        $project: {
          data: 1,
          total: { $arrayElemAt: ['$meta.total', 0] },
        },
      },
    ]);

    const res: GetFoodsResponse = {
      data: foods[0].data,
      meta: {
        total: foods[0].total,
        limit: limit,
        offset: offset,
      },
    };

    return res;
  }
}
