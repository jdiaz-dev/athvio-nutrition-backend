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

  async addPlanMeal({ professional, program, plan, ...rest }: AddPlanMealDto, selectors: string[]): Promise<Program> {
    const programRes = await this.programModel.findOneAndUpdate(
      { _id: program, professional },
      { $push: { 'plans.$[el].planMeals': { ...rest } } },
      {
        arrayFilters: [{ 'el._id': new Types.ObjectId(plan), 'el.isDeleted': false }],
        new: true,
        projection: selectors,
      },
    );
    selectors;
    return programRes;
  }

  async updatePlanMeal(
    { professional, program, plan, meal, ...rest }: UpdateMealDto,
    selectors: string[],
  ): Promise<Program> {
    rest;

    const programRes = await this.programModel.findOneAndUpdate(
      { _id: program, professional },
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
            'plan._id': new Types.ObjectId(plan),
            'plan.isDeleted': false,
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

  async deletePlanMeal(
    { professional, program, plan, meal }: DeletePlanMealDto,
    selectors: string[],
  ): Promise<Program> {
    const programRes = await this.programModel.findOneAndUpdate(
      { _id: program, professional },
      {
        $pull: {
          'plans.$[plan].planMeals': { _id: new Types.ObjectId(meal) },
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
