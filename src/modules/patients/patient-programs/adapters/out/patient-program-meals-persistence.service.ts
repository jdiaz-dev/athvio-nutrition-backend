import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
import { AthvioLoggerService } from 'src/shared/adapters/observability/athvio-logger.service';
import { ProgramQueryFragmentsService } from 'src/shared/adapters/database/program-query-fragments.service';
import { MongodbQueryBuilder } from 'src/shared/adapters/database/mongodb-query-builder';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { Trazability } from 'src/shared/types';
import {
  PatientProgram,
  PatientProgramDocument,
} from 'src/modules/patients/patient-programs/adapters/out/patient-program.schema';
import { AddPatientProgramPlanMeal } from 'src/modules/patients/patient-programs/types/patient-program';
import { UpdatePatientProgramMealDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program-plan-meals/update-patient-program-meal.dto';
import { DeletePatientProgramMealDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program-plan-meals/delete-patient-program-meal.dto';

@Injectable()
export class PatientProgramMealsPersistenceService extends MongodbQueryBuilder<PatientProgramDocument> {
  constructor(
    @InjectModel(PatientProgram.name) protected readonly programModel: Model<PatientProgramDocument>,
    protected readonly logger: AthvioLoggerService,
    protected readonly als: AsyncLocalStorage<Trazability>,
  ) {
    super(programModel, logger, PatientProgram.name, als);
  }

  async addPatientProgramMeal(
    { patient, patientProgram, plan, meals }: AddPatientProgramPlanMeal,
    selectors: Record<string, number>,
  ): Promise<PatientProgram> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);

    const programRes = await this.initializeQuery(this.addPatientProgramMeal.name).findOneAndUpdate(
      { uuid: patientProgram, patient },
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

    return programRes;
  }

  async updatePatientProgramMeal(
    { patient, patientProgram, plan, meals }: UpdatePatientProgramMealDto,
    selectors: Record<string, number>,
  ): Promise<PatientProgram> {
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

    const programRes = await this.initializeQuery(this.updatePatientProgramMeal.name).findOneAndUpdate(
      { uuid: patientProgram, patient },
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

    return programRes;
  }

  async deletePatientProgramMeal(
    { patient, patientProgram, plan, meals }: DeletePatientProgramMealDto,
    selectors: Record<string, number>,
  ): Promise<PatientProgram> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);
    const deleteSubDocuments = meals.map((_item, index) => ({
      [`plans.$[plan].meals.$[meal${index}].isDeleted`]: true,
    }));
    const arrayFilters = meals.map((item, index) => ({
      [`meal${index}.uuid`]: item,
      [`meal${index}.isDeleted`]: false,
    }));
    const programRes = await this.initializeQuery(this.deletePatientProgramMeal.name).findOneAndUpdate(
      { uuid: patientProgram, patient },
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

    return programRes;
  }
}
