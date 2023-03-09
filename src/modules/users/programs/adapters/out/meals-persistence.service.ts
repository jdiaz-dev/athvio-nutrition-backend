import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { AddPlanMealDto } from 'src/modules/users/programs/adapters/in/dtos/plan-meal/add-plan-meal.dto';
import { DeleteProgramPlanDto } from 'src/modules/users/programs/adapters/in/dtos/program-plan/delete-program-plan.dto';
import { UpdateProgramPlanDto } from 'src/modules/users/programs/adapters/in/dtos/program-plan/update-program-plan.dto';
import { Program, ProgramDocument } from 'src/modules/users/programs/adapters/out/program.schema';

@Injectable()
export class MealsPersistenceService {
  constructor(@InjectModel(Program.name) private readonly programModel: Model<ProgramDocument>) {}

  async addPlanMeal(
    { programId, planId, ...rest }: AddPlanMealDto,
    userId: string,
    selectors: string[],
  ): Promise<Program> {
    const program = await this.programModel.findOneAndUpdate(
      { _id: programId, userId },
      { $push: { 'plans.$[el].planMeals': { ...rest } } },
      {
        arrayFilters: [{ 'el._id': new Types.ObjectId(planId), 'el.isDeleted': false }],
        new: true,
        projection: selectors,
      },
    );
    selectors;
    // .populate('tags plans');
    console.log('-------program PLAN MEAL', program);
    return program;

    /* const program = await this.programModel.create({
      userId,
      ...dto,
    });
    return program; */
  }

  async updateProgramPlan(dto: UpdateProgramPlanDto, userId: string, selectors: string[]): Promise<Program> {
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
    console.log('-------program', program);
    return program;
  }

  async deleteProgramPlan(dto: DeleteProgramPlanDto, userId: string, selectors: string[]): Promise<Program> {
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
    console.log('-------program', program);
    return program;
  }
}
