import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DeleteProgramPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/plan/delete-program-plan.dto';
import { UpdatePlanAssignedWeekDayDto } from 'src/modules/professionals/programs/adapters/in/dtos/plan/update-plan-assigned-week-day.dto';
import { Program, ProgramDocument } from 'src/modules/professionals/programs/adapters/out/program.schema';
import {
  AddProgramPlanWithMeals,
  ProgramPatial,
  ProgramPlanFilteredByDay,
} from 'src/modules/professionals/programs/types/program';
import { ErrorProgramEnum } from 'src/shared/enums/messages-response';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { ProgramQueryFragmentsService } from 'src/modules/professionals/programs/adapters/out/program-query-fragments.service';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { MongodbQueryBuilder } from 'src/shared/database/mongodb-query-builder';

@Injectable()
export class PlansPersistenceService extends MongodbQueryBuilder<ProgramDocument> {
  constructor(
    @InjectModel(Program.name) protected readonly programModel: Model<ProgramDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(programModel, logger, Program.name);
  }

  async addProgramPlanWithMeals(
    { professional, program, planBody }: AddProgramPlanWithMeals,
    selectors: Record<string, number>,
  ): Promise<Program> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);
    const programRes = await this.initializeQuery(this.addProgramPlanWithMeals.name).findOneAndUpdate(
      { _id: program, professional, isDeleted: false },
      {
        $push: {
          plans: {
            ...planBody,
          },
        },
      },
      {
        new: true,
        projection: {
          ...restFields,
          plans: ProgramQueryFragmentsService.filterPlansAndNestedMeals(),
        },
      },
    );
    if (programRes == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return programRes;
  }

  async updatePlanAssignedWeekDay(
    { professional, ...rest }: UpdatePlanAssignedWeekDayDto,
    selectors: Record<string, number>,
  ): Promise<Program> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);

    const programRes = await this.initializeQuery(this.updatePlanAssignedWeekDay.name).findOneAndUpdate(
      { _id: rest.program, professional, isDeleted: false },
      { $set: { 'plans.$[plan].week': rest.week, 'plans.$[plan].day': rest.day } },
      {
        arrayFilters: [{ 'plan._id': new Types.ObjectId(rest.plan), 'plan.isDeleted': false }],
        new: true,
        projection: {
          ...restFields,
          plans: ProgramQueryFragmentsService.filterPlansAndNestedMeals(),
        },
      },
    );
    if (programRes == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return programRes;
  }
  async getProgramPlanFilteredByDay(
    { professional, program, day }: ProgramPlanFilteredByDay,
    selectors: Record<string, number>,
  ): Promise<ProgramPatial> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);
    const programRes = await this.initializeQuery(this.getProgramPlanFilteredByDay.name).aggregate([
      {
        $match: {
          uuid: program,
          professional,
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
                $and: [{ $eq: ['$$plan.isDeleted', false] }, { $gte: ['$$plan.day', day] }],
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

    return programRes[0] as Program;
  }

  async deleteProgramPlan({ professional, ...rest }: DeleteProgramPlanDto, selectors: string[]): Promise<Program> {
    const programRes = await this.initializeQuery(this.deleteProgramPlan.name).findOneAndUpdate(
      { _id: rest.program, professional, isDeleted: false },
      {
        $pull: {
          plans: { _id: new Types.ObjectId(rest.plan), isDeleted: false },
        },
      },
      {
        new: true,
        projection: selectors,
      },
    );
    if (programRes == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return programRes;
  }
}
