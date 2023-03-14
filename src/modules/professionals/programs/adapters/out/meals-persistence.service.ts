import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { AddPlanMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/add-plan-meal.dto';
import { DeletePlanMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/delete-plan-meal.dto';
import { UpdateMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/update-meal.dto';
import { Program, ProgramDocument } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ErrorProgramEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class MealsPersistenceService {
  constructor(@InjectModel(Program.name) private readonly programModel: Model<ProgramDocument>) {}

  async addPlanMeal(
    { professionalId, programId, planId, ...rest }: AddPlanMealDto,
    selectors: string[],
  ): Promise<Program> {
    const program = await this.programModel.findOneAndUpdate(
      { _id: programId, professionalId },
      { $push: { 'plans.$[el].planMeals': { ...rest } } },
      {
        arrayFilters: [{ 'el._id': new Types.ObjectId(planId), 'el.isDeleted': false }],
        new: true,
        projection: selectors,
      },
    );
    selectors;
    return program;
  }

  async updatePlanMeal(
    { professionalId, programId, planId, mealId, ...rest }: UpdateMealDto,
    selectors: string[],
  ): Promise<Program> {
    rest;

    const program = await this.programModel.findOneAndUpdate(
      { _id: programId, professionalId },
      {
        $set: {
          'plans.$[plan].planMeals.$[meal].position': rest.position,
          'plans.$[plan].planMeals.$[meal].recipeName': rest.recipeName,
          'plans.$[plan].planMeals.$[meal].ingredients': rest.ingredients,
          'plans.$[plan].planMeals.$[meal].recipe': rest.recipe,
          'plans.$[plan].planMeals.$[meal].macros': rest.macros,
        },
      },
      {
        arrayFilters: [
          {
            'plan._id': new Types.ObjectId(planId),
            'plan.isDeleted': false,
          },
          {
            'meal._id': new Types.ObjectId(mealId),
          },
        ],
        new: true,
        projection: selectors,
      },
    );
    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return program;
  }

  async deletePlanMeal(
    { professionalId, programId, planId, mealId }: DeletePlanMealDto,
    selectors: string[],
  ): Promise<Program> {
    const program = await this.programModel.findOneAndUpdate(
      { _id: programId, professionalId },
      {
        $pull: {
          'plans.$[plan].planMeals': { _id: new Types.ObjectId(mealId) },
        },
      },
      {
        arrayFilters: [
          {
            'plan._id': new Types.ObjectId(planId),
            'plan.isDeleted': false,
          },
          /* {
            'meal._id': new Types.ObjectId(mealId),
          }, */
        ],
        new: true,
        projection: selectors,
      },
    );

    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return program;
  }
}
