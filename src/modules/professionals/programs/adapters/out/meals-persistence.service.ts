import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { AddMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/add-meal.dto';
import { DeleteMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/delete-meal.dto';
import { UpdateMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/update-meal.dto';
import { ProgramQueryHelpersService } from 'src/modules/professionals/programs/adapters/out/program-query-helpers.service';
import { Program, ProgramDocument } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ErrorProgramEnum, InternalErrors } from 'src/shared/enums/messages-response';
import { LayersServer } from 'src/shared/enums/project';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { AthvioLoggerService } from 'src/shared/services/athvio-logger.service';

@Injectable()
export class MealsPersistenceService {
  private layer = LayersServer.INFRAESTRUCTURE;

  constructor(
    @InjectModel(Program.name) private readonly programModel: Model<ProgramDocument>,
    private readonly logger: AthvioLoggerService,
  ) {}

  async addMeal({ professional, program, plan, meals }: AddMealDto, selectors: Record<string, number>): Promise<Program> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);

    try {
      const programRes = await this.programModel.findOneAndUpdate(
        { _id: program, professional },
        { $push: { 'plans.$[plan].meals': { $each: meals } } },
        {
          arrayFilters: [{ 'plan._id': new Types.ObjectId(plan), 'plan.isDeleted': false }],
          new: true,
          projection: {
            ...restFields,
            plans: ProgramQueryHelpersService.filterPlansAndNestedMeals(),
          },
        },
      );
      if (programRes == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND, this.layer);

      return programRes;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
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
    }));

    const arrayFilters = meals.map((body, index) => ({
      [`meal${index}._id`]: new Types.ObjectId(body.meal),
      [`meal${index}.isDeleted`]: false,
    }));

    try {
      const programRes = await this.programModel.findOneAndUpdate(
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
            plans: ProgramQueryHelpersService.filterPlansAndNestedMeals(),
          },
        },
      );
      if (programRes == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND, this.layer);

      return programRes;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
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
    try {
      const programRes = await this.programModel.findOneAndUpdate(
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
            plans: ProgramQueryHelpersService.filterPlansAndNestedMeals(),
          },
        },
      );

      if (programRes == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND, this.layer);

      return programRes;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
}
