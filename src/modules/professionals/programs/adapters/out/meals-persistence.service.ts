import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { AddMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/add-meal.dto';
import { DeleteMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/delete-meal.dto';
import { UpdateMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/update-meal.dto';
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
    private readonly logger: AthvioLoggerService
  ) {}

  async addMeal({ professional, program, plan, mealBody }: AddMealDto, selectors: string[]): Promise<Program> {
    try {
      const programRes = await this.programModel.findOneAndUpdate(
        { _id: program, professional },
        { $push: { 'plans.$[plan].meals': { ...mealBody } } },
        {
          arrayFilters: [{ 'plan._id': new Types.ObjectId(plan), 'plan.isDeleted': false }],
          new: true,
          projection: selectors,
        },
      );
      if (programRes == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND, this.layer);

      return programRes;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }

  async updateMeal(
    { professional, program, plan, meal, mealBody }: UpdateMealDto,
    selectors: Record<string, number>,
  ): Promise<Program> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);

    try {
      const programRes = await this.programModel.findOneAndUpdate(
        { _id: program, professional },
        {
          $set: {
            'plans.$[plan].meals.$[meal].position': mealBody.position,
            'plans.$[plan].meals.$[meal].mealTag': mealBody.mealTag,
            'plans.$[plan].meals.$[meal].name': mealBody.name,
            'plans.$[plan].meals.$[meal].ingredientDetails': mealBody.ingredientDetails,
            'plans.$[plan].meals.$[meal].cookingInstructions': mealBody.cookingInstructions,
            'plans.$[plan].meals.$[meal].macros': mealBody.macros,
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
          projection: {
            ...restFields,
            plans: {
              $filter: {
                input: '$plans',
                as: 'plan',
                cond: {
                  $and: [{ $eq: ['$$plan.isDeleted', false] }],
                },
              },
            },
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

  async deleteMeal({ professional, program, plan, meal }: DeleteMealDto, selectors: string[]): Promise<Program> {
    try {
      const programRes = await this.programModel.findOneAndUpdate(
        { _id: program, professional },
        {
          $pull: {
            'plans.$[plan].meals': { _id: new Types.ObjectId(meal) },
          },
        },
        {
          arrayFilters: [
            {
              'plan._id': new Types.ObjectId(plan),
              'plan.isDeleted': false,
            },
          ],
          new: true,
          projection: selectors,
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
