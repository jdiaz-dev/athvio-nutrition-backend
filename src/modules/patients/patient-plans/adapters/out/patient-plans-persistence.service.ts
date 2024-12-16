import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DeletePatientPlanDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/plan/delete-patient-plan.dto';
import { GetPatientPlanDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/plan/get-patient-plan.dto';
import { GetPatientPlansDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/plan/get-patient-plans.dto';
import { UpdatePatientPlanDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/plan/update-patient-plan.dto';
import { PatientPlanQueryFragmentsService } from 'src/modules/patients/patient-plans/adapters/out/patient-plan-query-fragments.service';
import { PatientPlan, PatientPlanDocument } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import {
  CreatePatientPlanBody,
  PatientPlanPartial,
  PatientWithAssignedDate,
} from 'src/modules/patients/patient-plans/adapters/out/patient-plan.type';
import { ErrorPatientPlanEnum, InternalErrors } from 'src/shared/enums/messages-response';
import { LayersServer } from 'src/shared/enums/project';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { AthvioLoggerService } from 'src/shared/services/athvio-logger.service';

@Injectable()
export class PatientPlansPersistenceService {
  constructor(
    @InjectModel(PatientPlan.name) private readonly clienPlanModel: Model<PatientPlanDocument>,
    private readonly logger: AthvioLoggerService,
  ) {}

  async createPatientPlan(dto: CreatePatientPlanBody): Promise<PatientPlan> {
    const patientPlan = await this.clienPlanModel.create({
      ...dto,
    });
    return patientPlan;
  }
  async createManyPatientPlan(dto: PatientPlanPartial[]): Promise<PatientPlan[]> {
    const patientPlans = await this.clienPlanModel.insertMany(dto);
    return patientPlans;
  }
  async getPatientPlan({ patient, patientPlan }: GetPatientPlanDto, selectors: Record<string, number>): Promise<PatientPlan> {
    const restFields = removeAttributesWithFieldNames(selectors, ['meals']);
    patient;

    try {
      const patientPlanRes = await this.clienPlanModel.aggregate([
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
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async getPatientPlans({ patient, ...rest }: GetPatientPlansDto, selectors: Record<string, number>): Promise<PatientPlan[]> {
    const restFields = removeAttributesWithFieldNames(selectors, ['meals']);

    try {
      const patientPlans = await this.clienPlanModel.aggregate([
        {
          $match: {
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
        {
          $sort: { assignedDate: 1 },
        },
        {
          $facet: {
            data: [
              {
                $skip: rest.offset,
              },
              {
                $limit: rest.limit,
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
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async getManyPatientPlans(
    patientWithAssignedDate: PatientWithAssignedDate[],
    selectors: Record<string, number>,
  ): Promise<PatientPlan[]> {
    try {
      const patientPlans = await this.clienPlanModel.find(
        {
          $or: patientWithAssignedDate,
        },
        selectors,
      );
      return patientPlans;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async updatePatientPlan(
    { patientPlan, patient, ...rest }: UpdatePatientPlanDto,
    selectors: Record<string, number>,
  ): Promise<PatientPlan> {
    const restFields = removeAttributesWithFieldNames(selectors, ['meals']);
    try {
      const patientPlanRes = await this.clienPlanModel.findOneAndUpdate(
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
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }

  async deletePatientPlan({ patientPlan, patient }: DeletePatientPlanDto, selectors: string[]): Promise<PatientPlan> {
    try {
      const patientPlanRes = await this.clienPlanModel.findOneAndUpdate(
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
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
}
