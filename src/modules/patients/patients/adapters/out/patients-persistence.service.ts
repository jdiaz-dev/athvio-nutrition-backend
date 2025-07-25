import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model, UpdateWriteOpResult } from 'mongoose';
import { GetPatientsDto, GetPatientsResponse } from 'src/modules/patients/patients/adapters/in/web/dtos/get-patients.dto';
import { Patient, PatientDocument } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { ManagePatientStateDto } from 'src/modules/patients/patients/adapters/in/web/dtos/manage-patient-state.dto';
import { ManagePatientGroupDto } from 'src/modules/patients/patients/adapters/in/web/dtos/manage-patient-group.dto';
import { PatientState, ManagePatientGroup } from 'src/shared/enums/project';
import {
  CreatePatient,
  DeleteManyPatientGroup,
  PatientPopulatedWithUser,
} from 'src/modules/patients/patients/helpers/patient.types';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { searchByFieldsGenerator } from 'src/shared/helpers/mongodb-helpers';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { MongodbQueryBuilder } from 'src/shared/database/mongodb-query-builder';
import { UpdatePatientWebDto } from 'src/modules/patients/patients/adapters/in/web/dtos/update-patient.dto';

//todo: add loggers to log internal errors
@Injectable()
export class PatientsPersistenceService extends MongodbQueryBuilder<PatientDocument> {
  constructor(
    @InjectModel(Patient.name) protected readonly patientModel: Model<PatientDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(patientModel, logger, Patient.name);
  }

  async createPatient({ professional, ...body }: CreatePatient): Promise<FlattenMaps<Patient>> {
    const patient = await this.initializeQuery(this.createPatient.name).create({
      professional,
      ...body,
    });
    return patient.toJSON();
  }
  async getPatientPopulatedWithUser(
    { uuid, professional }: { uuid: string; professional?: string },
    selectors?: Record<string, number>,
  ): Promise<PatientPopulatedWithUser> {
    const isFromExternalRequest = selectors ? true : false;

    const patientRes = await this.initializeQuery(this.getPatientPopulatedWithUser.name).aggregate([
      {
        $match: { uuid, ...(professional && { professional }) },
      },
      {
        $lookup: {
          from: 'Users',
          localField: 'user',
          foreignField: 'uuid',
          as: 'user',
        },
      },
      {
        $project: {
          // to get user as object instead of array
          user: {
            $arrayElemAt: ['$user', 0],
          },
          ...(isFromExternalRequest && removeAttributesWithFieldNames(selectors, ['user'])),
        },
      },
      ...(isFromExternalRequest ? [{ $project: selectors }] : []),
    ]);

    return patientRes[0];
  }
  async getPatientById(patientId: string): Promise<Patient> {
    const patientRes = await this.initializeQuery(this.getPatientById.name).findOne({
      _id: patientId,
    });

    return patientRes;
  }
  async getPatientByUser(user: string): Promise<Patient> {
    const patientRes = await this.initializeQuery(this.getPatientByUser.name).findOne({
      user,
      state: PatientState.ACTIVE,
    });
    return patientRes;
  }
  async getManyPatientsByIds(patients: string[]): Promise<Patient[]> {
    const patientsRes = await this.initializeQuery(this.getManyPatientsByIds.name).find({ uuid: { $in: patients } }, { uuid: 1 });

    return patientsRes;
  }
  async getPatients({ professional, ...dto }: GetPatientsDto, selectors: Record<string, number>): Promise<GetPatientsResponse> {
    const combinedFields = searchByFieldsGenerator(['user.firstname', 'user.lastname'], dto.search);
    const restFields = removeAttributesWithFieldNames(selectors, ['user']);

    //todo: move this conditional to application layer
    const states =
      dto.state === PatientState.ACTIVE
        ? [{ state: dto.state }, { state: PatientState.INVITATION_PENDING }]
        : [{ state: PatientState.ARCHIVED }];

    const patients = await this.initializeQuery(this.getPatients.name).aggregate([
      {
        $match: {
          professional,
          $or: states,
        },
      },
      {
        $lookup: {
          from: 'Users',
          localField: 'user',
          foreignField: 'uuid',
          as: 'user',
        },
      },
      {
        //looking group for every _id contained in groups array
        $lookup: {
          from: 'PatientGroups',
          let: {
            letGroups: '$groups',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$uuid', '$$letGroups'],
                },
              },
            },
          ],
          as: 'groups',
        },
      },
      {
        $project: {
          // to get user as object instead of array
          user: {
            $arrayElemAt: ['$user', 0],
          },
          ...restFields,
        },
      },
      {
        $match: {
          $or: combinedFields,
        },
      },
      {
        $facet: {
          data: [
            {
              $skip: dto.offset,
            },
            {
              $limit: dto.limit,
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
          total: { $ifNull: [{ $arrayElemAt: ['$meta.total', 0] }, 0] },
        },
      },
    ]);

    const res: GetPatientsResponse = {
      data: patients[0].data,
      meta: {
        total: patients[0].total,
        limit: dto.limit,
        offset: dto.offset,
      },
    };
    return res;
  }
  async updatePatientByUser({ user, ...rest }: Pick<Patient, 'user'> & Partial<Patient>, selectors?: string[]): Promise<Patient> {
    const patientRes = await this.initializeQuery(this.updatePatientByUser.name).findOneAndUpdate(
      { user },
      { ...rest },
      { projection: selectors || [], new: true },
    );

    return patientRes;
  }
  async updatePatientByUuid({ patient, professional, ...rest }: UpdatePatientWebDto, selectors?: string[]): Promise<Patient> {
    const patientRes = await this.initializeQuery(this.updatePatientByUser.name).findOneAndUpdate(
      { uuid: patient, professional },
      { ...rest },
      { projection: selectors || [], new: true },
    );

    return patientRes;
  }
  async updatePatientGroup({ professional, patient, action, patientGroup }: ManagePatientGroupDto): Promise<Patient> {
    const _action = action === ManagePatientGroup.ADD ? { $push: { groups: patientGroup } } : { $pull: { groups: patientGroup } };

    const patientRes = await this.initializeQuery(this.updatePatientGroup.name).findOneAndUpdate(
      { uuid: patient, professional },
      _action,
      {
        new: true,
        populate: [
          {
            path: 'groups',
            localField: 'groups',
            foreignField: 'uuid',
            model: 'PatientGroup',
          },
        ],
      },
    );

    return patientRes;
  }
  async deleteManyPatientGroup({ professional, patientGroup }: DeleteManyPatientGroup): Promise<UpdateWriteOpResult> {
    const recordsUpdated = await this.initializeQuery(this.deleteManyPatientGroup.name).updateMany(
      { professional, groups: patientGroup },
      { $pull: { groups: patientGroup } },
    );
    return recordsUpdated;
  }
  async managePatientState({ professional, ...dto }: ManagePatientStateDto, selectors: string[]): Promise<Patient> {
    const patientRes = await this.initializeQuery(this.managePatientState.name).findOneAndUpdate(
      {
        uuid: dto.patient,
        professional: professional,
      },
      { state: dto.state },
      { projection: selectors },
    );

    return patientRes;
  }
}
