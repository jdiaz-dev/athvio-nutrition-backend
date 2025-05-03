import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PatientPlan, PatientPlanDocument } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { ErrorPatientPlanEnum, InternalErrors } from 'src/shared/enums/messages-response';
import { UpdatePlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/meals/update-meal.dto';
import { DeletePlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/meals/delete-meal-plan.dto';
import { LayersServer } from 'src/shared/enums/project';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { PatientPlanQueryFragmentsService } from 'src/modules/patients/patient-plans/adapters/out/patient-plan-query-fragments.service';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { AddPlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/meals/add-meal.dto';

@Injectable()
export class PatientPlanNutritionalMealsPersistenceService {
  constructor(
    @InjectModel(PatientPlan.name) private readonly clienPlanModel: Model<PatientPlanDocument>,
    private readonly logger: AthvioLoggerService,
  ) {}

  async addMealToPlan({ patient, patientPlan, meals }: AddPlanMealDto, selectors: Record<string, number>): Promise<PatientPlan> {
    const restFields = removeAttributesWithFieldNames(selectors, ['meals']);

    try {
      const patientPlanRes = await this.clienPlanModel.findOneAndUpdate(
        { _id: patientPlan, patient, isDeleted: false },
        { $push: { meals: { $each: meals } } },
        {
          projection: {
            ...restFields,
            meals: PatientPlanQueryFragmentsService.filterNestedMeals(),
          },
          new: true,
        },
      );
      return patientPlanRes;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async updatePlanMeal(
    { patient, patientPlan, meals }: UpdatePlanMealDto,
    selectors: Record<string, number>,
  ): Promise<PatientPlan> {
    const restFields = removeAttributesWithFieldNames(selectors, ['meals']);
    const updateSubDocuments = meals.map((body, index) => ({
      [`meals.$[meal${index}].position`]: body.position,
      [`meals.$[meal${index}].mealTag`]: body.mealTag,
      [`meals.$[meal${index}].name`]: body.name,
      [`meals.$[meal${index}].ingredientDetails`]: body.ingredientDetails,
      [`meals.$[meal${index}].cookingInstructions`]: body.cookingInstructions,
      [`meals.$[meal${index}].macros`]: body.macros,
    }));

    const arrayFilters = meals.map((body, index) => ({
      [`meal${index}._id`]: new Types.ObjectId(body.meal),
      [`meal${index}.isDeleted`]: false,
    }));

    try {
      const programRes = await this.clienPlanModel.findOneAndUpdate(
        { _id: patientPlan, patient },
        { $set: Object.assign({}, ...updateSubDocuments) },
        {
          arrayFilters: [...arrayFilters],
          new: true,
          projection: {
            ...restFields,
            meals: PatientPlanQueryFragmentsService.filterNestedMeals(),
          },
        },
      );
      if (programRes == null) throw new BadRequestException(ErrorPatientPlanEnum.CLIENT_PLAN_NOT_FOUND);

      return programRes;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }

  async deletePlanMeal(
    { patientPlan, patient, meals }: DeletePlanMealDto,
    selectors: Record<string, number>,
  ): Promise<PatientPlan> {
    const restFields = removeAttributesWithFieldNames(selectors, ['meals']);

    const deleteSubDocuments = meals.map((_item, index) => ({
      [`meals.$[meal${index}].isDeleted`]: true,
    }));
    const arrayFilters = meals.map((item, index) => ({
      [`meal${index}._id`]: new Types.ObjectId(item),
      [`meal${index}.isDeleted`]: false,
    }));
    try {
      const programRes = await this.clienPlanModel.findOneAndUpdate(
        { _id: patientPlan, patient },
        { $set: Object.assign({}, ...deleteSubDocuments) },
        {
          arrayFilters: [...arrayFilters],
          new: true,
          projection: {
            ...restFields,
            meals: PatientPlanQueryFragmentsService.filterNestedMeals(),
          },
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
