import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AsyncLocalStorage } from 'node:async_hooks';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { DeleteProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/delete-program.dto';
import {
  GetProgramsDto,
  GetProgramsResponse,
} from 'src/modules/professionals/programs/adapters/in/dtos/program/get-programs.dto';
import { ManageProgramTagDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/manage-program-tag.dto';
import { UpdateProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/update-program.dto';
import { ProgramQueryFragmentsService } from 'src/modules/professionals/programs/adapters/out/program-query-fragments.service';
import { Program, ProgramDocument } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { CreateProgram, GetProgram } from 'src/modules/professionals/programs/types/program';
import { MongodbQueryBuilder } from 'src/shared/adapters/out/database/mongodb-query-builder';
import { EnumSources, ManageProgramTags } from 'src/shared/enums/project';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { searchByFieldsGenerator } from 'src/shared/helpers/mongodb-helpers';
import { Trazability } from 'src/shared/types';

@Injectable()
export class ProgramsPersistenceService extends MongodbQueryBuilder<ProgramDocument> {
  constructor(
    @InjectModel(Program.name) protected readonly programModel: Model<ProgramDocument>,
    protected readonly logger: AthvioLoggerService,
    protected readonly als: AsyncLocalStorage<Trazability>,
  ) {
    super(programModel, logger, Program.name, als);
  }

  async createProgram({ professional, ...rest }: CreateProgram): Promise<Program> {
    const programRes = await this.initializeQuery(this.createProgram.name).create({
      professional,
      ...rest,
    });

    return programRes;
  }

  async getProgram(
    { professional, program, name, source, plan }: GetProgram,
    selectors?: Record<string, number>,
  ): Promise<Program | null> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);

    const programRes = await this.initializeQuery(this.getProgram.name).aggregate([
      {
        $match: {
          ...(program && professional && { uuid: program, professional }),
          ...(name && source && { name, source }),
          isDeleted: false,
        },
      },
      ...(selectors
        ? [
            {
              $project: {
                ...restFields,
                plans: {
                  $filter: {
                    input: '$plans',
                    as: 'plan',
                    cond: {
                      $and: [{ $eq: ['$$plan.isDeleted', false] }, plan ? { $eq: ['$$plan.uuid', plan] } : {}],
                    },
                  },
                },
              },
            },
            {
              $project: {
                ...restFields,
                plans: ProgramQueryFragmentsService.filterPlansAndNestedMeals(),
              },
            },
            {
              $project: {
                ...restFields,
                plans: ProgramQueryFragmentsService.sortPlansByDay(),
              },
            },
            {
              $project: {
                ...selectors,
              },
            },
          ]
        : []),
    ]);

    return programRes[0] as Program;
  }
  async getPrograms({ professional, ...rest }: GetProgramsDto, selectors: Record<string, number>): Promise<GetProgramsResponse> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);
    const fieldsToSearch = searchByFieldsGenerator(['name'], rest.search);

    const programs = await this.initializeQuery(this.getPrograms.name).aggregate([
      {
        $match: {
          professional,
          source: EnumSources.PROFESSIONAL,
          isDeleted: false,
        },
      },
      {
        $match: {
          $or: fieldsToSearch,
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

    const res: GetProgramsResponse = {
      data: programs[0].data,
      meta: {
        total: programs[0].total ? programs[0].total : 0,
        limit: rest.limit,
        offset: rest.offset,
      },
    };

    return res;
  }
  async updateProgram({ professional, program, ...rest }: UpdateProgramDto): Promise<Program | null> {
    const programRes = await this.initializeQuery(this.updateProgram.name).findOneAndUpdate(
      { uuid: program, professional, source: EnumSources.PROFESSIONAL, isDeleted: false },
      { ...rest },
      { new: true, populate: 'programTags' },
    );

    return programRes;
  }

  async updateProgramTag({ professional, program, action, ...rest }: ManageProgramTagDto): Promise<Program | null> {
    const _action =
      action === ManageProgramTags.ADD
        ? { $push: { programTags: rest.programTag } }
        : { $pull: { programTags: rest.programTag } };

    const programRes = await this.initializeQuery(this.updateProgramTag.name).findOneAndUpdate(
      { uuid: program, professional, source: EnumSources.PROFESSIONAL, isDeleted: false },
      _action,
      {
        new: true,
        populate: 'programTags',
      },
    );

    return programRes;
  }
  async updateProgramPatients(program: string, professional: string, patients: string[]): Promise<Program | null> {
    const programRes = await this.initializeQuery(this.updateProgramPatients.name).findOneAndUpdate(
      { uuid: program, professional, source: EnumSources.PROFESSIONAL, isDeleted: false },
      { $push: { patients } },
      {
        new: true,
        populate: 'programTags',
      },
    );

    return programRes;
  }

  async deleteProgram({ professional, ...rest }: DeleteProgramDto, selectors: string[]): Promise<Program | null> {
    selectors;
    const programRes = await this.initializeQuery(this.deleteProgram.name).findOneAndUpdate(
      {
        uuid: rest.program,
        professional,
        source: EnumSources.PROFESSIONAL,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      { new: true },
    );

    return programRes;
  }
}
