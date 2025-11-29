import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PatientPlan, PatientPlanDocument } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { ErrorPatientPlanEnum } from 'src/shared/enums/messages-response';
import { UpdatePlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/meals/update-meal.dto';
import { DeletePlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/meals/delete-meal-plan.dto';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { PatientPlanQueryFragmentsService } from 'src/modules/patients/patient-plans/adapters/out/patient-plan-query-fragments.service';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { AddPlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/meals/add-meal.dto';
import { MongodbQueryBuilder } from 'src/shared/database/mongodb-query-builder';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Trazability } from 'src/shared/types';

@Injectable()
export class PatientPlanNutritionalMealsPersistenceService extends MongodbQueryBuilder<PatientPlanDocument> {
  constructor(
    @InjectModel(PatientPlan.name) protected readonly clienPlanModel: Model<PatientPlanDocument>,
    protected readonly logger: AthvioLoggerService,
    protected readonly als: AsyncLocalStorage<Trazability>,
  ) {
    super(clienPlanModel, logger, PatientPlan.name, als);
  }

  async addMealToPlan({ patient, patientPlan, meals }: AddPlanMealDto, selectors: Record<string, number>): Promise<PatientPlan> {
    const restFields = removeAttributesWithFieldNames(selectors, ['meals']);

    const patientPlanRes = await this.initializeQuery(this.addMealToPlan.name).findOneAndUpdate(
      { uuid: patientPlan, patient, isDeleted: false },
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
      [`meals.$[meal${index}].image`]: body.image,
      [`meals.$[meal${index}].imageSource`]: body.imageSource,
    }));

    const arrayFilters = meals.map((body, index) => ({
      [`meal${index}.uuid`]: body.meal,
      [`meal${index}.isDeleted`]: false,
    }));

    const programRes = await this.initializeQuery(this.updatePlanMeal.name).findOneAndUpdate(
      { uuid: patientPlan, patient },
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
      [`meal${index}.uuid`]: item,
      [`meal${index}.isDeleted`]: false,
    }));
    const programRes = await this.initializeQuery(this.deletePlanMeal.name).findOneAndUpdate(
      { uuid: patientPlan, patient },
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
  }
}
