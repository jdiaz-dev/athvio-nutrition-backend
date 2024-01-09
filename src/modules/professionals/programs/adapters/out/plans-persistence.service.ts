import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { AddProgramPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/plan/add-program-plan.dto';
import { DeleteProgramPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/plan/delete-program-plan.dto';
import { UpdatePlanAssignedWeekDayDto } from 'src/modules/professionals/programs/adapters/in/dtos/plan/update-plan-assigned-week-day.dto';
import { Program, ProgramDocument } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ProgramPatial, ProgramPlanFilteredByDay } from 'src/modules/professionals/programs/adapters/out/program.types';
import { ErrorProgramEnum } from 'src/shared/enums/messages-response';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';

@Injectable()
export class PlansPersistenceService {
  constructor(@InjectModel(Program.name) private readonly programModel: Model<ProgramDocument>) {}

  async addProgramPlan({ professional, program, ...rest }: AddProgramPlanDto, selectors: Record<string, number>): Promise<Program> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);
    const programRes = await this.programModel
      .findOneAndUpdate(
        { _id: program, professional, isDeleted: false },
        { $push: { plans: rest } }, {
        new: true, projection: {
          ...restFields,
          plans: {
            $filter: {
              input: '$plans',
              as: 'plan',
              cond: {
                $and: [
                  { $eq: ['$$plan.isDeleted', false] }
                ]
              }
            }
          }
        }
      });
    // .populate('programTags plans');
    if (programRes == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return programRes;
  }

  async addProgramPlan2({ professional, program, ...rest }: AddProgramPlanDto, selectors: Record<string, number>): Promise<Program> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);
    restFields;
    const programRes = await this.programModel
      .aggregate([
        {
          $match: {
            _id: program, professional, isDeleted: false
          },

        },
        {
          $group: { '_id': 1 }
        }
      ]);
    if (programRes == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return programRes[0];
  }

  async updatePlanAssignedWeekDay({ professional, ...rest }: UpdatePlanAssignedWeekDayDto, selectors: Record<string, number>): Promise<Program> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);

    const programRes = await this.programModel.findOneAndUpdate(
      { _id: rest.program, professional, isDeleted: false },
      { $set: { 'plans.$[plan].week': rest.week, 'plans.$[plan].day': rest.day } },
      {
        arrayFilters: [
          { 'plan._id': new Types.ObjectId(rest.plan), 'plan.isDeleted': false },
        ],
        new: true,
        projection: {
          ...restFields,
          plans: {
            $filter: {
              input: '$plans',
              as: 'plan',
              cond: {
                $and: [
                  { $eq: ['$$plan.isDeleted', false] }
                ]
              }
            }
          }
        },
      },
    );
    if (programRes == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return programRes;
  }
  async getProgramPlanFilteredByDay({ professional, program, day }: ProgramPlanFilteredByDay, selectors: Record<string, number>): Promise<ProgramPatial> {
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
                $and: [
                  { $eq: ['$$plan.isDeleted', false] }, { $gte: ['$$plan.day', day] }
                ]
              }
            }
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

  async deleteProgramPlan({ professional, ...rest }: DeleteProgramPlanDto, selectors: string[]): Promise<Program> {
    selectors;
    const programRes = await this.programModel.findOneAndUpdate(
      { _id: rest.program, professional, isDeleted: false },
      { $set: { 'plans.$[el].isDeleted': true } },
      {
        arrayFilters: [{ 'el._id': new Types.ObjectId(rest.plan), 'el.isDeleted': false }],
        new: true,
        projection: selectors,
      },
    );
    if (programRes == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return programRes;
  }
}
