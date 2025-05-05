import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InternalErrors } from 'src/shared/enums/messages-response';

import { LayersServer } from 'src/shared/enums/project';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { InternalFood, InternalFoodDocument } from 'src/modules/program-generator/foods/adapters/out/internal-food.schema';
import { searchByFieldsGenerator } from 'src/shared/helpers/mongodb-helpers';
import { GetFoods } from 'src/modules/program-generator/foods/helpers/foods';

@Injectable()
export class InternalFoodsPersistenceService {
  constructor(
    @InjectModel(InternalFood.name) private readonly foodModel: Model<InternalFoodDocument>,
    private readonly logger: AthvioLoggerService,
  ) {}

  async saveInternalFoods(data: Omit<InternalFood, '_id' | 'createdAt' | 'updatedAt'>[]): Promise<InternalFood[]> {
    try {
      const res = await this.foodModel.insertMany(data);
      return res;
    } catch (error: unknown) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error, message: (error as Error).message });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async getInternalFoods(dto: GetFoods): Promise<InternalFood[]> {
    const combinedFields = searchByFieldsGenerator(['foodDetails.label'], dto.search);

    try {
      const foodsRes = await this.foodModel.aggregate([
        {
          $match: {
            $or: combinedFields,
          },
        },
      ]);

      return foodsRes;
    } catch (error: unknown) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error, message: (error as Error).message });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
}
