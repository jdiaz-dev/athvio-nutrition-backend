import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { InternalErrors } from 'src/shared/enums/messages-response';

import { LayersServer } from 'src/shared/enums/project';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { InternalFood, InternalFoodDocument } from 'src/modules/program-generator/foods/adapters/out/internal-food.schema';

//todo: add loggers to log internal errors
@Injectable()
export class InternalFoodsPersistenceService {
  constructor(
    @InjectModel(InternalFood.name) private readonly foodModel: Model<InternalFoodDocument>,
    private readonly logger: AthvioLoggerService,
  ) {}

  async saveFoods(data: Omit<InternalFood, '_id' | 'createdAt' | 'updatedAt'>[]): Promise<InternalFood[]> {
    try {
      const res = await this.foodModel.insertMany(data);
      return res;
    } catch (error: unknown) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error, message: (error as Error).message });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async getPatient(filters: Record<string, string>, selectors: Record<string, number>): Promise<Patient> {
    const restFields = removeAttributesWithFieldNames(selectors, ['user']);

    let mappedFilters: any = {};
    for (let filter in filters) {
      mappedFilters[filter] = new Types.ObjectId(filters[filter]);
    }

    try {
      const patientRes = await this.foodModel.aggregate([
        {
          $match: { ...mappedFilters },
        },
        {
          $lookup: {
            from: 'Users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $project: {
            // to get user as object instead of array
            user: {
              $arrayElemAt: ['$user', 0],
            },
            ...restFields,
          },
        },
        {
          $project: selectors,
        },
      ]);

      return patientRes[0];
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
}
