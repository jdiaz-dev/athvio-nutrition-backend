import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PatientPlan, PatientPlanDocument } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { ErrorPatientPlanEnum, InternalErrors } from 'src/shared/enums/messages-response';
import { AddPlanMealDto } from '../in/dtos/meals/add-meal.dto';
import { UpdatePlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/meals/update-meal.dto';
import { DeletePlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/meals/delete-meal-plan.dto';
import { AthvioLoggerService } from 'src/shared/services/athvio-logger.service';
import { LayersServer } from 'src/shared/enums/project';

@Injectable()
export class PatientPlanMealsPersistenceService {
  constructor(
    @InjectModel(PatientPlan.name) private readonly clienPlanModel: Model<PatientPlanDocument>,
    private readonly logger: AthvioLoggerService,
  ) {}

  async addMealToPlan({ patient, patientPlan, mealBody }: AddPlanMealDto, selectors: string[]): Promise<PatientPlan> {
    try {
      const patientPlanRes = await this.clienPlanModel.findOneAndUpdate(
        { _id: patientPlan, patient, isDeleted: false },
        { $push: { meals: { ...mealBody } } },
        { projection: selectors, new: true },
      );

      return patientPlanRes;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async updatePlanMeal({ patient, patientPlan, meal, mealBody }: UpdatePlanMealDto, selectors: string[]): Promise<PatientPlan> {
    try {
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
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }

  async deletePlanMeal({ patientPlan, patient, meal }: DeletePlanMealDto, selectors: string[]): Promise<PatientPlan> {
    try {
      const programRes = await this.clienPlanModel.findOneAndUpdate(
        { _id: patientPlan, patient },
        {
          $pull: {
            meals: { _id: new Types.ObjectId(meal) },
          },
        },
        {
          new: true,
          projection: selectors,
        },
      );

      if (programRes == null) throw new BadRequestException(ErrorPatientPlanEnum.CLIENT_PLAN_NOT_FOUND);

      return programRes;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
}
