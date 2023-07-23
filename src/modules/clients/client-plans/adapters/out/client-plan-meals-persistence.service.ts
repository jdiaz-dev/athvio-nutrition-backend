import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ClientPlan, ClientPlanDocument } from 'src/modules/clients/client-plans/adapters/out/client-plan.schema';
import { ErrorClientPlanEnum } from 'src/shared/enums/messages-response';
import { AddPlanMealDto } from '../in/dtos/meals/add-meal.dto';
import { UpdatePlanMealDto } from 'src/modules/clients/client-plans/adapters/in/dtos/meals/update-meal.dto';
import { DeletePlanMealDto } from 'src/modules/clients/client-plans/adapters/in/dtos/meals/delete-meal-plan.dto';

@Injectable()
export class ClientPlanMealsPersistenceService {
  constructor(@InjectModel(ClientPlan.name) private readonly clienPlanModel: Model<ClientPlanDocument>) {}

  async addMealToPlan({ client, clientPlan, mealBody }: AddPlanMealDto, selectors: string[]): Promise<ClientPlan> {
    const clientPlanRes = await this.clienPlanModel
      .findOneAndUpdate({ _id: clientPlan, client, isDeleted: false }, { $push: { meals: { ...mealBody } } }, { projection: selectors, new: true },
      )
    if (clientPlanRes == null) throw new BadRequestException(ErrorClientPlanEnum.CLIENT_PLAN_NOT_FOUND);

    return clientPlanRes;
  }
  async updatePlanMeal({ client, clientPlan, meal, mealBody }: UpdatePlanMealDto, selectors: string[]): Promise<ClientPlan> {
    const programRes = await this.clienPlanModel.findOneAndUpdate(
      { _id: clientPlan, client },
      {
        $set: {
          'meals.$[meal].position': mealBody.position,
          'meals.$[meal].mealTag': mealBody.mealTag,
          'meals.$[meal].name': mealBody.name,
          'meals.$[meal].ingredientDetails': mealBody.ingredientDetails,
          'meals.$[meal].cookingInstructions': mealBody.cookingInstructions,
          'meals.$[meal].macros': mealBody.macros,
        },
      },
      {
        arrayFilters: [
          {
            'meal._id': new Types.ObjectId(meal),
            'meal.isDeleted': false,
          },
        ],
        new: true,
        projection: selectors,
      },
    );
    if (programRes == null) throw new BadRequestException(ErrorClientPlanEnum.CLIENT_PLAN_NOT_FOUND);

    return programRes;
  }

  async deletePlanMeal({ clientPlan, client, meal }: DeletePlanMealDto, selectors: string[]): Promise<ClientPlan> {
    const programRes = await this.clienPlanModel.findOneAndUpdate(
      { _id: clientPlan, client },
      {
        $pull: {
          'meals': { _id: new Types.ObjectId(meal) },
        },
      },
      {
        /* arrayFilters: [
          {
            'plan._id': new Types.ObjectId(plan),
            'plan.isDeleted': false,
          },
        ], */
        new: true,
        projection: selectors,
      },
    );

    if (programRes == null) throw new BadRequestException(ErrorClientPlanEnum.CLIENT_PLAN_NOT_FOUND);

    return programRes;
  }
}
