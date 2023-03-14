import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { AddProgramPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/plan/add-program-plan.dto';
import { DeleteProgramPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/plan/delete-program-plan.dto';
import { UpdateProgramPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/plan/update-program-plan.dto';
import { Program, ProgramDocument } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ErrorProgramEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class PlansPersistenceService {
  constructor(@InjectModel(Program.name) private readonly programModel: Model<ProgramDocument>) {}

  async addProgramPlan(
    { professionalId, programId, ...rest }: AddProgramPlanDto,
    selectors: string[],
  ): Promise<Program> {
    const program = await this.programModel
      .findOneAndUpdate({ _id: programId, professionalId }, { $push: { plans: { ...rest } } }, { new: true })
      .populate('tags plans');
    selectors;
    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return program;
  }

  async updateProgramPlan({ professionalId, ...rest }: UpdateProgramPlanDto, selectors: string[]): Promise<Program> {
    const program = await this.programModel.findOneAndUpdate(
      { _id: rest.programId, professionalId, isDeleted: false },
      { $set: { 'plans.$[el].week': rest.week, 'plans.$[el].day': rest.day } },
      {
        arrayFilters: [{ 'el._id': new Types.ObjectId(rest.planId), 'el.isDeleted': false }],
        new: true,
        projection: selectors,
      },
    );
    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return program;
  }

  async deleteProgramPlan({ professionalId, ...rest }: DeleteProgramPlanDto, selectors: string[]): Promise<Program> {
    selectors;
    const program = await this.programModel.findOneAndUpdate(
      { _id: rest.programId, professionalId, isDeleted: false },
      { $set: { 'plans.$[el].isDeleted': true } },
      {
        arrayFilters: [{ 'el._id': new Types.ObjectId(rest.planId), 'el.isDeleted': false }],
        new: true,
        projection: selectors,
      },
    );
    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return program;
  }
}
