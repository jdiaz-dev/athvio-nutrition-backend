import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { AddMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/add-meal.dto';
import { DeleteMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/delete-meal.dto';
import { UpdateMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/update-meal.dto';
import { Program, ProgramDocument } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ErrorProgramEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class MealsPersistenceService {
  constructor(@InjectModel(Program.name) private readonly programModel: Model<ProgramDocument>) {}

  async addMeal({ professional, program, plan, mealPlan, mealBody }: AddMealDto, selectors: string[]): Promise<Program> {
    const programRes = await this.programModel.findOneAndUpdate(
      { _id: program, professional },
      { $push: { 'plans.$[plan].mealPlans.$[mealPlan].meals': { ...mealBody } } },
      {
        arrayFilters: [
          { 'plan._id': new Types.ObjectId(plan), 'plan.isDeleted': false },
          { 'mealPlan._id': new Types.ObjectId(mealPlan), 'mealPlan.isDeleted': false },
        ],
        new: true,
        projection: selectors,
      },
    );
    if (programRes == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return programRes;
  }

  async updateMeal(
    { professional, program, plan, mealPlan, meal, mealBody }: UpdateMealDto,
    selectors: string[],
  ): Promise<Program> {
    const programRes = await this.programModel.findOneAndUpdate(
      { _id: program, professional },
      {
        $set: {
          'plans.$[plan].mealPlans.$[mealPlan].meals.$[meal].name': mealBody.name,
          'plans.$[plan].mealPlans.$[mealPlan].meals.$[meal].ingredients': mealBody.ingredientDetail,
          'plans.$[plan].mealPlans.$[mealPlan].meals.$[meal].cookingInstruction': mealBody.cookingInstruction,
          'plans.$[plan].mealPlans.$[mealPlan].meals.$[meal].macros': mealBody.macros,
        },
      },
      {
        arrayFilters: [
          {
            'plan._id': new Types.ObjectId(plan),
            'plan.isDeleted': false,
          },
          {
            'mealPlan._id': new Types.ObjectId(mealPlan),
          },
          {
            'meal._id': new Types.ObjectId(meal),
          },
        ],
        new: true,
        projection: selectors,
      },
    );
    if (programRes == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return programRes;
  }

  async deleteMeal({ professional, program, plan, meal, mealPlan }: DeleteMealDto, selectors: string[]): Promise<Program> {
    const programRes = await this.programModel.findOneAndUpdate(
      { _id: program, professional },
      {
        $pull: {
          'plans.$[plan].mealPlans.$[mealPlan].meals': { _id: new Types.ObjectId(meal) },
        },
      },
      {
        arrayFilters: [
          {
            'plan._id': new Types.ObjectId(plan),
            'plan.isDeleted': false,
          },
          {
            'mealPlan._id': new Types.ObjectId(mealPlan),
            'mealPlan.isDeleted': false,
          },
        ],
        new: true,
        projection: selectors,
      },
    );

    if (programRes == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return programRes;
  }
}
