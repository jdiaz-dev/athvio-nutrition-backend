import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { AddMealPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/add-plan-meal.dto';
import { DeleteMealPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/delete-plan-meal.dto';
import { UpdateMealPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/update-meal.dto';
import { Program, ProgramDocument } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ErrorProgramEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class MealsPersistenceService {
  constructor(@InjectModel(Program.name) private readonly programModel: Model<ProgramDocument>) {}

  async addMealPlan({ professional, program, plan, mealPlanBody }: AddMealPlanDto, selectors: string[]): Promise<Program> {
    const programRes = await this.programModel.findOneAndUpdate(
      { _id: program, professional },
      { $push: { 'plans.$[plan].mealPlans': { ...mealPlanBody } } },
      {
        arrayFilters: [{ 'plan._id': new Types.ObjectId(plan), 'plan.isDeleted': false }],
        new: true,
        projection: selectors,
      },
    );
    selectors;
    return programRes;
  }

  async updateMealPlan(
    { professional, program, plan, mealPlan, mealPlanBody }: UpdateMealPlanDto,
    selectors: string[],
  ): Promise<Program> {
    const programRes = await this.programModel.findOneAndUpdate(
      { _id: program, professional },
      {
        $set: {
          'plans.$[plan].mealPlans.$[mealPlan].position': mealPlanBody.position,
          'plans.$[plan].mealPlans.$[mealPlan].name': mealPlanBody.name,
          'plans.$[plan].mealPlans.$[mealPlan].ingredients': mealPlanBody.ingredients,
          'plans.$[plan].mealPlans.$[mealPlan].cookingInstruction': mealPlanBody.cookingInstruction,
          'plans.$[plan].mealPlans.$[mealPlan].macros': mealPlanBody.macros,
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
        ],
        new: true,
        projection: selectors,
      },
    );
    if (programRes == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return programRes;
  }

  async deleteMealPlan({ professional, program, plan, mealPlan }: DeleteMealPlanDto, selectors: string[]): Promise<Program> {
    const programRes = await this.programModel.findOneAndUpdate(
      { _id: program, professional },
      {
        $pull: {
          'plans.$[plan].mealPlans': { _id: new Types.ObjectId(mealPlan) },
        },
      },
      {
        arrayFilters: [
          {
            'plan._id': new Types.ObjectId(plan),
            'plan.isDeleted': false,
          },
          /* {
            'meal._id': new Types.ObjectId(meal),
          }, */
        ],
        new: true,
        projection: selectors,
      },
    );

    if (programRes == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return programRes;
  }
}
