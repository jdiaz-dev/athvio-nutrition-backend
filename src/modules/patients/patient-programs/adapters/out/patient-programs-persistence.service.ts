import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AsyncLocalStorage } from 'node:async_hooks';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import {
  GetPatientProgramsDto,
  GetPatientProgramsResponse,
} from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program/get-patient-programs.dto';
import {
  PatientProgram,
  PatientProgramDocument,
} from 'src/modules/patients/patient-programs/adapters/out/patient-program.schema';
import { CreatePatientProgram } from 'src/modules/patients/patient-programs/types/patient-program';
import { MongodbQueryBuilder } from 'src/shared/adapters/out/database/mongodb-query-builder';
import { ProgramQueryFragmentsService } from 'src/shared/adapters/out/database/program-query-fragments.service';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { Trazability } from 'src/shared/types';

@Injectable()
export class PatientProgramsPersistenceService extends MongodbQueryBuilder<PatientProgramDocument> {
  constructor(
    @InjectModel(PatientProgram.name) protected readonly programModel: Model<PatientProgramDocument>,
    protected readonly logger: AthvioLoggerService,
    protected readonly als: AsyncLocalStorage<Trazability>,
  ) {
    super(programModel, logger, PatientProgram.name, als);
  }

  async createPatientPrograms(body: CreatePatientProgram[]): Promise<PatientProgramDocument[]> {
    const programRes = await this.initializeQuery(this.createPatientPrograms.name).insertMany(body);

    return programRes;
  }

  async getPatientPrograms(
    { patient, ...rest }: GetPatientProgramsDto,
    selectors: Record<string, number>,
  ): Promise<GetPatientProgramsResponse> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);

    const programs = await this.initializeQuery(this.getPatientPrograms.name).aggregate([
      {
        $match: {
          patient,
          isDeleted: false,
        },
      },

      {
        $project: {
          ...restFields,
          createdAt: 1,
          plans: { $filter: { input: '$plans', as: 'plan', cond: { $eq: ['$$plan.isDeleted', false] } } },
        },
      },
      {
        $project: {
          ...restFields,
          plans: ProgramQueryFragmentsService.sortPlansByDay(),
        },
      },
      {
        //looking group for every _id contained in groups array
        $lookup: {
          from: 'ProgramTags',
          let: {
            letProgramTags: '$programTags',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    {
                      $toString: '$uuid',
                    },
                    '$$letProgramTags',
                  ],
                },
              },
            },
          ],
          as: 'programTags',
        },
      },
      {
        $sort: { createdAt: 1 },
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

    const res: GetPatientProgramsResponse = {
      data: programs[0].data,
      meta: {
        total: programs[0].total ? programs[0].total : 0,
        limit: rest.limit,
        offset: rest.offset,
      },
    };

    return res;
  }
}
