import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { AddPlanDto } from 'src/modules/users/programs/adapters/in/dtos/plan/add-plan.dto';
import { DeletePlanDto } from 'src/modules/users/programs/adapters/in/dtos/plan/delete-plan.dto';
import { UpdatePlanDto } from 'src/modules/users/programs/adapters/in/dtos/plan/update-plan.dto';
import { Program, ProgramDocument } from 'src/modules/users/programs/adapters/out/program.schema';
import { ErrorProgramEnum } from 'src/shared/enums/messages-bad-request';

@Injectable()
export class PlansPersistenceService {
  constructor(@InjectModel(Program.name) private readonly programModel: Model<ProgramDocument>) {}

  async addProgramPlan(dto: AddPlanDto, userId: string, selectors: string[]): Promise<Program> {
    const program = await this.programModel
      .findOneAndUpdate(
        { _id: dto.programId, userId },
        { $push: { plans: { week: dto.week, day: dto.day } } },
        { new: true, projection: selectors },
      )
      .populate('tags plans');
    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return program;
  }

  async updateProgramPlan(dto: UpdatePlanDto, userId: string, selectors: string[]): Promise<Program> {
    selectors;
    // const myselector = ['name', 'plans.week', 'plans.day']
    const program = await this.programModel.findOneAndUpdate(
      { _id: dto.programId, userId, isDeleted: false },
      { $set: { 'plans.$[el].week': dto.week, 'plans.$[el].day': dto.day } },
      {
        arrayFilters: [{ 'el._id': new Types.ObjectId(dto.planId), 'el.isDeleted': false }],
        new: true,
        projection: selectors,
      },
    );
    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return program;
  }

  async deleteProgramPlan(dto: DeletePlanDto, userId: string, selectors: string[]): Promise<Program> {
    selectors;
    const program = await this.programModel.findOneAndUpdate(
      { _id: dto.programId, userId, isDeleted: false },
      { $set: { 'plans.$[el].isDeleted': true } },
      {
        arrayFilters: [{ 'el._id': new Types.ObjectId(dto.planId), 'el.isDeleted': false }],
        new: true,
        projection: selectors,
      },
    );
    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return program;
  }
}
