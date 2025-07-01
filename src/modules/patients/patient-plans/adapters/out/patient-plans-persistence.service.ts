import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { GetPatientPlansForMobileDto } from 'src/modules/patients/patient-plans/adapters/in/mobile/dtos/get-patient-plans-for-mobile.dto';
import { DeletePatientPlanDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/plan/delete-patient-plan.dto';
import { GetPatientPlanDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/plan/get-patient-plan.dto';
import { GetPatientPlansForWebDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/plan/get-patient-plans-for-web.dto';
import { UpdatePatientPlanDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/plan/update-patient-plan.dto';
import { PatientPlanQueryFragmentsService } from 'src/modules/patients/patient-plans/adapters/out/patient-plan-query-fragments.service';
import { PatientPlan, PatientPlanDocument } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import {
  CreatePatientPlanBody,
  PatientPlanPartial,
  PatientWithAssignedDate,
} from 'src/modules/patients/patient-plans/adapters/out/patient-plan.type';
import { MongodbQueryBuilder } from 'src/shared/database/mongodb-query-builder';
import { ErrorPatientPlanEnum } from 'src/shared/enums/messages-response';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';

@Injectable()
export class PatientPlansPersistenceService extends MongodbQueryBuilder<PatientPlanDocument> {
  constructor(
    @InjectModel(PatientPlan.name) protected readonly clienPlanModel: Model<PatientPlanDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(clienPlanModel, logger, PatientPlan.name);
  }

  async createPatientPlan(dto: CreatePatientPlanBody): Promise<PatientPlan> {
    const patientPlan = await this.initializeQuery(this.createPatientPlan.name).create({
      ...dto,
    });
    return patientPlan;
  }
  async createManyPatientPlan(dto: PatientPlanPartial[]): Promise<PatientPlan[]> {
    const patientPlans = await this.initializeQuery(this.createManyPatientPlan.name).insertMany(dto);
    return patientPlans;
  }
  async getPatientPlan({ patient, patientPlan }: GetPatientPlanDto, selectors: Record<string, number>): Promise<PatientPlan> {
    const restFields = removeAttributesWithFieldNames(selectors, ['meals']);
    patient;

    const patientPlanRes = await this.initializeQuery(this.getPatientPlan.name).aggregate([
      {
        $match: {
          _id: new Types.ObjectId(patientPlan),
          patient: patient,
          isDeleted: false,
        },
      },
      {
        $project: {
          ...restFields,
          meals: PatientPlanQueryFragmentsService.filterNestedMeals(),
        },
      },
    ]);
    if (patientPlanRes[0] == null) throw new BadRequestException(ErrorPatientPlanEnum.CLIENT_PLAN_NOT_FOUND);
    return patientPlanRes[0] as PatientPlan;
  }
  async getPatientPlans(
    { patient, offset, limit }: Omit<GetPatientPlansForWebDto, 'startDate' | 'endDate'> | GetPatientPlansForMobileDto,
    selectors: Record<string, number>,
    extraFilters: Record<string, unknown> | {} = {},
  ): Promise<PatientPlan[]> {
    const restFields = removeAttributesWithFieldNames(selectors, ['meals']);

    const patientPlans = await this.initializeQuery(this.getPatientPlans.name).aggregate([
      {
        $match: {
          patient: patient,
          isDeleted: false,
          ...extraFilters,
        },
      },
      {
        $project: {
          ...restFields,
          meals: PatientPlanQueryFragmentsService.filterNestedMeals(),
        },
      },
      {
        $sort: { assignedDate: 1 },
      },
      {
        $facet: {
          data: [
            {
              $skip: offset,
            },
            {
              $limit: limit,
            },
            {
              $project: selectors,
            },
          ],
          meta: [{ $count: 'total' }],
        },
      },
      {
        $project: {
          data: 1,
          total: { $arrayElemAt: ['$meta.total', 0] },
        },
      },
    ]);

    return patientPlans[0].data;
  }
  async getManyPatientPlans(
    patientWithAssignedDate: PatientWithAssignedDate[],
    selectors: Record<string, number>,
  ): Promise<PatientPlan[]> {
    const patientPlans = await this.initializeQuery(this.getManyPatientPlans.name).find(
      {
        $or: patientWithAssignedDate,
      },
      selectors,
    );
    return patientPlans;
  }
  async updatePatientPlan(
    { patientPlan, patient, ...rest }: UpdatePatientPlanDto,
    selectors: Record<string, number>,
  ): Promise<PatientPlan> {
    const restFields = removeAttributesWithFieldNames(selectors, ['meals']);
    const patientPlanRes = await this.initializeQuery(this.updatePatientPlan.name).findOneAndUpdate(
      { _id: patientPlan, patient, isDeleted: false },
      { ...rest },
      {
        new: true,
        projection: {
          ...restFields,
          meals: PatientPlanQueryFragmentsService.filterNestedMeals(),
        },
      },
    );

    if (patientPlanRes == null) throw new BadRequestException(ErrorPatientPlanEnum.CLIENT_PLAN_NOT_FOUND);
    return patientPlanRes;
  }

  async deletePatientPlan({ patientPlan, patient }: DeletePatientPlanDto, selectors: string[]): Promise<PatientPlan> {
    const patientPlanRes = await this.initializeQuery(this.deletePatientPlan.name).findOneAndUpdate(
      {
        _id: patientPlan,
        patient,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        new: true,
        projection: selectors,
      },
    );
    if (patientPlanRes == null) throw new BadRequestException(ErrorPatientPlanEnum.CLIENT_PLAN_NOT_FOUND);

    return patientPlanRes;
  }
}
