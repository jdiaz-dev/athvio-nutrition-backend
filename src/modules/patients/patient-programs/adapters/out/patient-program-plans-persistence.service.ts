import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { ProgramQueryFragmentsService } from 'src/shared/adapters/database/program-query-fragments.service';
import { AthvioLoggerService } from 'src/shared/adapters/observability/athvio-logger.service';
import { MongodbQueryBuilder } from 'src/shared/adapters/database/mongodb-query-builder';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Trazability } from 'src/shared/types';
import { EnumSources } from 'src/shared/enums/project';
import {
  PatientProgram,
  PatientProgramDocument,
} from 'src/modules/patients/patient-programs/adapters/out/patient-program.schema';
import { AddPatientProgramPlanWithMeals } from 'src/modules/patients/patient-programs/types/patient-program';
import { UpdatePatientProgramPlanWeekDayDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program-plans/update-patient-program-plan-week-day.dto';
import { DeletePatientProgramPlanDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program-plans/delete-patient-program-plan.dto';

@Injectable()
export class PatientProgramPlansPersistenceService extends MongodbQueryBuilder<PatientProgramDocument> {
  constructor(
    @InjectModel(PatientProgram.name) protected readonly programModel: Model<PatientProgramDocument>,
    protected readonly logger: AthvioLoggerService,
    protected readonly als: AsyncLocalStorage<Trazability>,
  ) {
    super(programModel, logger, PatientProgram.name, als);
  }

  async addPatientProgramPlanWithMeals(
    { patient, patientProgram, planBody }: AddPatientProgramPlanWithMeals,
    selectors: Record<string, number>,
  ): Promise<PatientProgram> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);
    const patientProgramRes = await this.initializeQuery(this.addPatientProgramPlanWithMeals.name).findOneAndUpdate(
      { uuid: patientProgram, patient, isDeleted: false },
      {
        $push: {
          plans: {
            ...planBody,
          },
        },
      },
      {
        new: true,
        projection: {
          ...restFields,
          plans: ProgramQueryFragmentsService.filterPlansAndNestedMeals(),
        },
      },
    );
    return patientProgramRes;
  }

  async updatePatientProgramPlanWeekDay(
    { patient, ...rest }: UpdatePatientProgramPlanWeekDayDto,
    selectors: Record<string, number>,
  ): Promise<PatientProgram> {
    const restFields = removeAttributesWithFieldNames(selectors, ['plans']);

    const programRes = await this.initializeQuery(this.updatePatientProgramPlanWeekDay.name).findOneAndUpdate(
      { uuid: rest.patientProgram, patient, isDeleted: false },
      { $set: { 'plans.$[plan].week': rest.week, 'plans.$[plan].day': rest.day } },
      {
        arrayFilters: [{ 'plan.uuid': rest.plan, 'plan.isDeleted': false }],
        new: true,
        projection: {
          ...restFields,
          plans: ProgramQueryFragmentsService.filterPlansAndNestedMeals(),
        },
      },
    );

    return programRes;
  }

  async deletePatientProgramPlan(
    { patient, ...rest }: DeletePatientProgramPlanDto,
    selectors: string[],
  ): Promise<PatientProgram> {
    const programRes = await this.initializeQuery(this.deletePatientProgramPlan.name).findOneAndUpdate(
      { uuid: rest.patientProgram, patient, source: EnumSources.PROFESSIONAL, isDeleted: false },
      {
        $pull: {
          plans: { uuid: rest.plan, isDeleted: false },
        },
      },
      {
        new: true,
        projection: selectors,
      },
    );

    return programRes;
  }
}
