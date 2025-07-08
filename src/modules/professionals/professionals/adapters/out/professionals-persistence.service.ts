import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Professional, ProfessionalDocument } from 'src/modules/professionals/professionals/adapters/out/professional.schema';
import { CreateProfessional, ProfessionalUser } from 'src/modules/professionals/professionals/adapters/out/professional.types';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { MongodbQueryBuilder } from 'src/shared/database/mongodb-query-builder';

@Injectable()
export class ProfessionalsPersistenceService extends MongodbQueryBuilder<ProfessionalDocument> {
  constructor(
    @InjectModel(Professional.name) protected professionalModel: Model<ProfessionalDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(professionalModel, logger, Professional.name);
  }

  async createProfessional(dto: CreateProfessional): Promise<Professional> {
    return await this.initializeQuery(this.createProfessional.name).create(dto);
  }
  async getProfessionalByIdentifier(
    match: { uuid?: string; _id?: Types.ObjectId },
    selectors?: Record<string, number>,
  ): Promise<ProfessionalUser> {
    const isFromExternalRequest = selectors ? true : false;

    const professionalRes = await this.initializeQuery(this.getProfessionalByIdentifier.name).aggregate([
      {
        $match: {
          ...match,
        },
      },
      {
        $lookup: {
          from: 'Users',
          localField: 'user',
          foreignField: 'uuid',
          as: 'user',
        },
      },
      {
        $project: {
          // to get user as object instead of array
          user: {
            $arrayElemAt: ['$user', 0],
          },
          ...(isFromExternalRequest && removeAttributesWithFieldNames(selectors, ['user'])),
        },
      },
      ...(isFromExternalRequest ? [{ $project: selectors }] : []),
    ]);
    return professionalRes[0] as ProfessionalUser;
  }
  async getProfessionalByUser(user: string): Promise<Professional> {
    const professionalRes = await this.initializeQuery(this.getProfessionalByUser.name).findOne({ user, isActive: true });

    return professionalRes;
  }
}
