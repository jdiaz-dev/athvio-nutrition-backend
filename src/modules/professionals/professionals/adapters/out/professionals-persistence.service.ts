import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Professional, ProfessionalDocument } from 'src/modules/professionals/professionals/adapters/out/professional.schema';
import { CreateProfessional, ProfessionalUser } from 'src/modules/professionals/professionals/adapters/out/professional.types';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { BaseRepository } from 'src/shared/database/base-repository';

@Injectable()
export class ProfessionalsPersistenceService extends BaseRepository<ProfessionalDocument> {
  constructor(
    @InjectModel(Professional.name) protected professionalModel: Model<ProfessionalDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(professionalModel, logger, Professional.name);
  }

  async createProfessional(dto: CreateProfessional): Promise<Professional> {
    return await this.create(dto);
  }
  async getProfessionalById(professional: string, selectors: Record<string, number>): Promise<ProfessionalUser> {
    const restFields = removeAttributesWithFieldNames(selectors, ['user']);
    restFields;
    const professionalRes = await this.aggregate([
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
    return professionalRes[0] as ProfessionalUser;
  }
  async getProfessionalByUser(user: string): Promise<Professional> {
    const professionalRes = await this.findOne({ user, isActive: true });

    return professionalRes;
  }
  updateTemplateMode() {}
}
