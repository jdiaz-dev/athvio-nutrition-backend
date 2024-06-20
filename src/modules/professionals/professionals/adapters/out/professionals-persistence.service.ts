import { InternalServerErrorException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InternalErrors } from 'src/shared/enums/messages-response';
import { Professional, ProfessionalDocument } from 'src/modules/professionals/professionals/adapters/out/professional.schema';
import { CreateProfessional } from 'src/modules/professionals/professionals/adapters/out/professional.types';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { LayersApplication } from 'src/shared/enums/project';

@Injectable()
export class ProfessionalsPersistenceService {
  private errorDetail = LayersApplication.INFRAESTRUCTURE;

  constructor(@InjectModel(Professional.name) private professionalModel: Model<ProfessionalDocument>) {}

  async createProfessional(dto: CreateProfessional): Promise<Professional> {
    try {
      return await this.professionalModel.create(dto);
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.errorDetail);
    }
  }
  async getProfessionalById(professional: string, selectors: Record<string, number>): Promise<Professional> {
    try {
      const restFields = removeAttributesWithFieldNames(selectors, ['user']);
      const professionalRes = await this.professionalModel.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(professional),
          },
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

      return professionalRes[0] as Professional;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.errorDetail);
    }
  }
  async getProfessionalByUser(user: string): Promise<Professional> {
    try {
      const professionalRes = await this.professionalModel.findOne({ user, isActive: true });

      return professionalRes;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.errorDetail);
    }
  }
  updateTemplateMode() {}
}
