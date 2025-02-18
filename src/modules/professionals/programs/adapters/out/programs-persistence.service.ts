import { InternalServerErrorException } from '@nestjs/common';
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
import { ProgramQueryFragmentsService } from 'src/modules/professionals/programs/adapters/out/program-query-fragments.service';
import { Program, ProgramDocument } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { InternalErrors } from 'src/shared/enums/messages-response';
import { LayersServer, ManageProgramTags } from 'src/shared/enums/project';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { searchByFieldsGenerator } from 'src/shared/helpers/mongodb-helpers';

@Injectable()
export class ProgramsPersistenceService {
  private layer = LayersServer.INFRAESTRUCTURE;

  constructor(@InjectModel(Program.name) private readonly programModel: Model<ProgramDocument>) {}

  async createProgram({ professional, ...rest }: CreateProgramDto): Promise<Program> {
    try {
      const programRes = await this.programModel.create({
        professional,
        ...rest,
      });

      return programRes;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }

  async getProgram({ professional, program, plan }: GetProgramDto, selectors: Record<string, number>): Promise<Program | null> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);

    try {
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
            plans: ProgramQueryFragmentsService.filterPlansAndNestedMeals(),
          },
        },
        {
          $project: {
            ...restFields,
            plans: ProgramQueryFragmentsService.sortPlansByDay(),
          },
        },
      ]);

      return programRes[0] as Program;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
  async getPrograms({ professional, ...rest }: GetProgramsDto, selectors: Record<string, number>): Promise<GetProgramsResponse> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);
    const fieldsToSearch = searchByFieldsGenerator(['name'], rest.search);

    try {
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
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
  async updateProgram({ professional, program, ...rest }: UpdateProgramDto): Promise<Program | null> {
    try {
      const programRes = await this.programModel.findOneAndUpdate(
        { _id: program, professional, isDeleted: false },
        { ...rest },
        { new: true, populate: 'programTags' },
      );

      return programRes;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }

  async updateProgramTag({ professional, program, action, ...rest }: ManageProgramTagDto): Promise<Program | null> {
    const _action =
      action === ManageProgramTags.ADD
        ? { $push: { programTags: rest.programTag } }
        : { $pull: { programTags: rest.programTag } };

    try {
      const programRes = await this.programModel.findOneAndUpdate({ _id: program, professional, isDeleted: false }, _action, {
        new: true,
        populate: 'programTags',
      });

      return programRes;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
  async updateProgramPatients(program: string, professional: string, patients: string[]): Promise<Program | null> {
    try {
      const programRes = await this.programModel.findOneAndUpdate(
        { _id: program, professional, isDeleted: false },
        { $push: { patients } },
        {
          new: true,
          populate: 'programTags',
        },
      );

      return programRes;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }

  async deleteProgram({ professional, ...rest }: DeleteProgramDto, selectors: string[]): Promise<Program | null> {
    selectors;
    try {
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

      return programRes;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
}
