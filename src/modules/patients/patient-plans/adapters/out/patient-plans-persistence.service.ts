import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DeletePatientPlanDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/plan/delete-patient-plan.dto';
import { GetPatientPlanDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/plan/get-patient-plan.dto';
import { GetPatientPlansDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/plan/get-patient-plans.dto';
import { UpdatePatientPlanDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/plan/update-patient-plan.dto';
import { PatientPlan, PatientPlanDocument } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import {
  CreatePatientPlanBody,
  PatientPlanPartial,
  PatientWithAssignedDate,
} from 'src/modules/patients/patient-plans/adapters/out/patient-plan.type';
import { ErrorPatientPlanEnum } from 'src/shared/enums/messages-response';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';

@Injectable()
export class PatientPlansPersistenceService {
  constructor(@InjectModel(PatientPlan.name) private readonly clienPlanModel: Model<PatientPlanDocument>) {}

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
          meals: {
            $filter: {
              input: '$meals',
              as: 'meal',
              cond: {
                $and: [
                  { $eq: ['$$meal.isDeleted', false] },
                  // plan ? { $eq: ['$$plan._id', new Types.ObjectId(plan)] } : {}
                ],
              },
            },
          },
        },
      },
    ]);
    if (patientPlanRes[0] == null) throw new BadRequestException(ErrorPatientPlanEnum.CLIENT_PLAN_NOT_FOUND);
    return patientPlanRes[0] as PatientPlan;
  }
  async getPatientPlans({ patient, ...rest }: GetPatientPlansDto, selectors: string[]): Promise<PatientPlan[]> {
    const patientPlans = await this.clienPlanModel.find(
      {
        patient,
        isDeleted: false,
      },
      selectors,
      {
        limit: rest.limit,
        skip: rest.offset,
        sort: rest.orderBy,
      },
    );

    return patientPlans;
  }
  async getManyPatientPlans(
    patientWithAssignedDate: PatientWithAssignedDate[],
    selectors: Record<string, number>,
  ): Promise<PatientPlan[]> {
    const patientPlans = await this.clienPlanModel.find(
      {
        $or: patientWithAssignedDate,
      },
      selectors,
    );
    return patientPlans;
  }
  async updatePatientPlan({ patientPlan, patient, ...rest }: UpdatePatientPlanDto, selectors: string[]): Promise<PatientPlan> {
    const patientPlanRes = await this.clienPlanModel.findOneAndUpdate(
      { _id: patientPlan, patient, isDeleted: false },
      { ...rest },
      { new: true, projection: selectors },
    );

    if (patientPlanRes == null) throw new BadRequestException(ErrorPatientPlanEnum.CLIENT_PLAN_NOT_FOUND);
    return patientPlanRes;
  }

  async deletePatientPlan({ patientPlan, patient }: DeletePatientPlanDto, selectors: string[]): Promise<PatientPlan> {
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
  }
}
