import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/create-program.dto';
import { DeleteProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/delete-program.dto';
import { GetProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/get-program.dto';
import {
  GetProgramsDto,
  GetProgramsResponse,
} from 'src/modules/professionals/programs/adapters/in/dtos/program/get-programs.dto';
import { ManageProgramTagDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/manage-program-tag.dto';
import { UpdateProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/update-program.dto';
import { Program, ProgramDocument } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ErrorProgramEnum } from 'src/shared/enums/messages-response';
import { ManageProgramTags } from 'src/shared/enums/project';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { searchByFieldsGenerator } from 'src/shared/helpers/mongodb-helpers';

@Injectable()
export class ProgramsPersistenceService {
  constructor(@InjectModel(Program.name) private readonly programModel: Model<ProgramDocument>) {}

  async createProgram({ professional, ...rest }: CreateProgramDto): Promise<Program> {
    const programRes = await this.programModel.create({
      professional,
      ...rest,
    });
    return programRes;
  }

  async getProgram({ professional, program, plan }: GetProgramDto, selectors: Record<string, number>): Promise<Program> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);
    const programRes = await this.programModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(program),
          professional: new Types.ObjectId(professional),
          isDeleted: false,
        },
      },
      {
        $project: {
          ...restFields,
          plans: {
            $filter: {
              input: '$plans',
              as: 'plan',
              cond: {
                $and: [{ $eq: ['$$plan.isDeleted', false] }, plan ? { $eq: ['$$plan._id', new Types.ObjectId(plan)] } : {}],
              },
            },
          },
        },
      },
      {
        $project: {
          ...restFields,
          plans: {
            $map: {
              input: '$plans',
              as: 'plan',
              in: {
                _id: '$$plan._id',
                title: '$$plan.title',
                week: '$$plan.week',
                day: '$$plan.day',
                meals: {
                  $filter: {
                    input: '$$plan.meals',
                    as: 'meal',
                    cond: { $eq: ['$$meal.isDeleted', false] },
                  },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          ...restFields,
          plans: { $sortArray: { input: '$plans', sortBy: { day: 1 } } },
        },
      },
    ]);
    if (programRes[0] == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);
    return programRes[0] as Program;
  }
  async getPrograms({ professional, ...rest }: GetProgramsDto, selectors: Record<string, number>): Promise<GetProgramsResponse> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);
    const fieldsToSearch = searchByFieldsGenerator(['name'], rest.search);

    const programs = await this.programModel.aggregate([
      {
        $match: {
          professional: new Types.ObjectId(professional),
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
                      $toString: '$_id',
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
  async updateProgram({ professional, program, ...rest }: UpdateProgramDto): Promise<Program> {
    const programRes = await this.programModel.findOneAndUpdate(
      { _id: program, professional, isDeleted: false },
      { ...rest },
      { new: true, populate: 'programTags' },
    );

    if (programRes == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);
    return programRes;
  }

  async updateProgramTag({ professional, program, action, ...rest }: ManageProgramTagDto): Promise<Program> {
    const _action =
      action === ManageProgramTags.ADD
        ? { $push: { programTags: rest.programTag } }
        : { $pull: { programTags: rest.programTag } };

    const programRes = await this.programModel.findOneAndUpdate({ _id: program, professional, isDeleted: false }, _action, {
      new: true,
      populate: 'programTags',
    });

    if (programRes == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return programRes;
  }
  async updateProgramPatients(program: string, professional: string, patients: string[]) {
    const programRes = await this.programModel.findOneAndUpdate(
      { _id: program, professional, isDeleted: false },
      { $push: { patients } },
      {
        new: true,
        populate: 'programTags',
      },
    );
    if (programRes == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);
    return programRes;
  }

  async deleteProgram({ professional, ...rest }: DeleteProgramDto, selectors: string[]): Promise<Program> {
    selectors;
    const programRes = await this.programModel.findOneAndUpdate(
      {
        _id: rest.program,
        professional,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      { new: true, populate: 'programTags' },
    );

    if (programRes == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return programRes;
  }
}
