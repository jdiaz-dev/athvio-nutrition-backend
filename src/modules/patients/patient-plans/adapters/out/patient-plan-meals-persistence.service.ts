import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PatientPlan, PatientPlanDocument } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { ErrorPatientPlanEnum } from 'src/shared/enums/messages-response';
import { AddPlanMealDto } from '../in/dtos/meals/add-meal.dto';
import { UpdatePlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/meals/update-meal.dto';
import { DeletePlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/meals/delete-meal-plan.dto';

@Injectable()
export class PatientPlanMealsPersistenceService {
  constructor(@InjectModel(PatientPlan.name) private readonly clienPlanModel: Model<PatientPlanDocument>) {}

  async addMealToPlan({ patient, patientPlan, mealBody }: AddPlanMealDto, selectors: string[]): Promise<PatientPlan> {
    const patientPlanRes = await this.clienPlanModel.findOneAndUpdate(
      { _id: patientPlan, patient, isDeleted: false },
      { $push: { meals: { ...mealBody } } },
      { projection: selectors, new: true },
    );
    if (patientPlanRes == null) throw new BadRequestException(ErrorPatientPlanEnum.CLIENT_PLAN_NOT_FOUND);

    console.log(JSON.stringify(patientPlanRes, null, 4));
    return patientPlanRes;
  }
  async updatePlanMeal({ patient, patientPlan, meal, mealBody }: UpdatePlanMealDto, selectors: string[]): Promise<PatientPlan> {
    const programRes = await this.clienPlanModel.findOneAndUpdate(
      { _id: patientPlan, patient },
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
    if (programRes == null) throw new BadRequestException(ErrorPatientPlanEnum.CLIENT_PLAN_NOT_FOUND);

    return programRes;
  }

  async deletePlanMeal({ patientPlan, patient, meal }: DeletePlanMealDto, selectors: string[]): Promise<PatientPlan> {
    const programRes = await this.clienPlanModel.findOneAndUpdate(
      { _id: patientPlan, patient },
      {
        $pull: {
          meals: { _id: new Types.ObjectId(meal) },
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

    if (programRes == null) throw new BadRequestException(ErrorPatientPlanEnum.CLIENT_PLAN_NOT_FOUND);

    return programRes;
  }
}
