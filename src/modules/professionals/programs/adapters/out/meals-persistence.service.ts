import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';

import { AddMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/add-meal.dto';
import { DeleteMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/delete-meal.dto';
import { UpdateMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/update-meal.dto';
import { ProgramQueryFragmentsService } from 'src/modules/professionals/programs/adapters/out/program-query-fragments.service';
import { Program, ProgramDocument } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { MongodbQueryBuilder } from 'src/shared/database/mongodb-query-builder';
import { ErrorProgramEnum } from 'src/shared/enums/messages-response';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';

@Injectable()
export class NutritionalMealsPersistenceService extends MongodbQueryBuilder<ProgramDocument> {
  constructor(
    @InjectModel(Program.name) protected readonly programModel: Model<ProgramDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(programModel, logger, Program.name);
  }

  async addMeal({ professional, program, plan, meals }: AddMealDto, selectors: Record<string, number>): Promise<Program> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);

    const programRes = await this.startQuery(this.addMeal.name).findOneAndUpdate(
      { _id: program, professional },
      { $push: { 'plans.$[plan].meals': { $each: meals } } },
      {
        arrayFilters: [{ 'plan._id': new Types.ObjectId(plan), 'plan.isDeleted': false }],
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

  async updateMeal({ professional, program, plan, meals }: UpdateMealDto, selectors: Record<string, number>): Promise<Program> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);

    const updateSubDocuments = meals.map((body, index) => ({
      [`plans.$[plan].meals.$[meal${index}].position`]: body.position,
      [`plans.$[plan].meals.$[meal${index}].mealTag`]: body.mealTag,
      [`plans.$[plan].meals.$[meal${index}].name`]: body.name,
      [`plans.$[plan].meals.$[meal${index}].ingredientDetails`]: body.ingredientDetails,
      [`plans.$[plan].meals.$[meal${index}].cookingInstructions`]: body.cookingInstructions,
      [`plans.$[plan].meals.$[meal${index}].macros`]: body.macros,
      [`plans.$[plan].meals.$[meal${index}].image`]: body.image,
    }));

    const arrayFilters = meals.map((body, index) => ({
      [`meal${index}._id`]: new Types.ObjectId(body.meal),
      [`meal${index}.isDeleted`]: false,
    }));

    const programRes = await this.startQuery(this.updateMeal.name).findOneAndUpdate(
      { _id: program, professional },
      { $set: Object.assign({}, ...updateSubDocuments) },
      {
        arrayFilters: [
          {
            'plan._id': new Types.ObjectId(plan),
            'plan.isDeleted': false,
          },
          ...arrayFilters,
        ],
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

  async deleteMeal({ professional, program, plan, meals }: DeleteMealDto, selectors: Record<string, number>): Promise<Program> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);
    const deleteSubDocuments = meals.map((_item, index) => ({
      [`plans.$[plan].meals.$[meal${index}].isDeleted`]: true,
    }));
    const arrayFilters = meals.map((item, index) => ({
      [`meal${index}._id`]: new Types.ObjectId(item),
      [`meal${index}.isDeleted`]: false,
    }));
    const programRes = await this.startQuery(this.deleteMeal.name).findOneAndUpdate(
      { _id: program, professional },
      { $set: Object.assign({}, ...deleteSubDocuments) },
      {
        arrayFilters: [
          {
            'plan._id': new Types.ObjectId(plan),
            'plan.isDeleted': false,
          },
          ...arrayFilters,
        ],
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
}
