import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
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
import { ErrorProgramEnum, InternalErrors } from 'src/shared/enums/messages-response';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { LayersServer } from 'src/shared/enums/project';
import { ProgramQueryFragmentsService } from 'src/modules/professionals/programs/adapters/out/program-query-fragments.service';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';

@Injectable()
export class PlansPersistenceService {
  constructor(
    @InjectModel(Program.name) private readonly programModel: Model<ProgramDocument>,
    private readonly logger: AthvioLoggerService,
  ) {}

  async addProgramPlanWithMeals(
    { professional, program, planBody }: AddProgramPlanWithMeals,
    selectors: Record<string, number>,
  ): Promise<Program> {
    try {
      const restFields = removeAttributesWithFieldNames(selectors, ['plans']);
      const programRes = await this.programModel.findOneAndUpdate(
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
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }

  async updatePlanAssignedWeekDay(
    { professional, ...rest }: UpdatePlanAssignedWeekDayDto,
    selectors: Record<string, number>,
  ): Promise<Program> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);

    try {
      const programRes = await this.programModel.findOneAndUpdate(
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
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async getProgramPlanFilteredByDay(
    { professional, program, day }: ProgramPlanFilteredByDay,
    selectors: Record<string, number>,
  ): Promise<ProgramPatial> {
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

      if (programRes[0] == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);
      return programRes[0] as Program;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }

  async deleteProgramPlan({ professional, ...rest }: DeleteProgramPlanDto, selectors: string[]): Promise<Program> {
    try {
      const programRes = await this.programModel.findOneAndUpdate(
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
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
}
