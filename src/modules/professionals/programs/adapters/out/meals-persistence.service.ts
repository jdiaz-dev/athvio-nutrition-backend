import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';

import { DeleteMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/delete-meal.dto';
import { UpdateMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/update-meal.dto';
import { ProgramQueryFragmentsService } from 'src/shared/adapters/out/database/program-query-fragments.service';
import { Program, ProgramDocument } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { AddPlanMeal } from 'src/modules/professionals/programs/types/program';
import { MongodbQueryBuilder } from 'src/shared/adapters/out/database/mongodb-query-builder';
import { ErrorProgramEnum } from 'src/shared/enums/messages-response';
import { EnumSources } from 'src/shared/enums/project';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { Trazability } from 'src/shared/types';

@Injectable()
export class MealsPersistenceService extends MongodbQueryBuilder<ProgramDocument> {
  constructor(
    @InjectModel(Program.name) protected readonly programModel: Model<ProgramDocument>,
    protected readonly logger: AthvioLoggerService,
    protected readonly als: AsyncLocalStorage<Trazability>,
  ) {
    super(programModel, logger, Program.name, als);
  }

  async addMeal({ professional, program, plan, meals }: AddPlanMeal, selectors: Record<string, number>): Promise<Program> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);

    const programRes = await this.initializeQuery(this.addMeal.name).findOneAndUpdate(
      { uuid: program, professional, source: EnumSources.PROFESSIONAL },
      { $push: { 'plans.$[plan].meals': { $each: meals.map((item) => ({ uuid: randomUUID(), ...item })) } } },
      {
        arrayFilters: [{ 'plan.uuid': plan, 'plan.isDeleted': false }],
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
      [`plans.$[plan].meals.$[meal${index}].imageSource`]: body.imageSource,
    }));

    const arrayFilters = meals.map((body, index) => ({
      [`meal${index}.uuid`]: body.meal,
      [`meal${index}.isDeleted`]: false,
    }));

    const programRes = await this.initializeQuery(this.updateMeal.name).findOneAndUpdate(
      { uuid: program, professional, source: EnumSources.PROFESSIONAL },
      { $set: Object.assign({}, ...updateSubDocuments) },
      {
        arrayFilters: [
          {
            'plan.uuid': plan,
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
      [`meal${index}.uuid`]: item,
      [`meal${index}.isDeleted`]: false,
    }));
    const programRes = await this.initializeQuery(this.deleteMeal.name).findOneAndUpdate(
      { uuid: program, professional, source: EnumSources.PROFESSIONAL },
      { $set: Object.assign({}, ...deleteSubDocuments) },
      {
        arrayFilters: [
          {
            'plan.uuid': plan,
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
