import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model, UpdateWriteOpResult, Types } from 'mongoose';
import { GetPatientsDto, GetPatientsResponse } from 'src/modules/patients/patients/adapters/in/web/dtos/get-patients.dto';
import { Patient, PatientDocument } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { ManagePatientStateDto } from 'src/modules/patients/patients/adapters/in/web/dtos/manage-patient-state.dto';
import { ManagePatientGroupDto } from 'src/modules/patients/patients/adapters/in/web/dtos/manage-patient-group.dto';
import { PatientState, ManagePatientGroup } from 'src/shared/enums/project';
import { CreatePatient, DeleteManyPatientGroup, PatientPopulatedWithUser, UpdatePatient } from 'src/modules/patients/patients/helpers/patient.types';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { searchByFieldsGenerator } from 'src/shared/helpers/mongodb-helpers';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { BaseRepository } from 'src/shared/database/base-repository';

//todo: add loggers to log internal errors
@Injectable()
export class PatientsPersistenceService extends BaseRepository<PatientDocument> {
  constructor(
    @InjectModel(Patient.name) protected readonly patientModel: Model<PatientDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(patientModel, logger, Patient.name);
  }

  async createPatient({ professional, ...body }: CreatePatient): Promise<FlattenMaps<Patient>> {
    const patient = await this.create({
      professional,
      ...body,
    });
    return patient.toJSON();
  }
  async getPatientPopulatedWithUser(
    { _id, professional }: { _id: string; professional?: string },
    selectors?: Record<string, number>,
  ): Promise<PatientPopulatedWithUser> {
    const isFromExternalRequest = selectors ? true : false;

    const patientRes = await this.aggregate([
      {
        $match: { _id: new Types.ObjectId(_id), ...(professional && { professional }) },
      },
      {
        $lookup: {
          from: 'Users',
          localField: 'user',
          foreignField: '_id',
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
    const patientRes = await this.findOne({
      _id: patientId,
    });

    return patientRes;
  }
  async getPatientByUser(user: string): Promise<Patient> {
    const patientRes = await this.findOne({
      user,
      state: PatientState.ACTIVE,
    });
    return patientRes;
  }
  async getManyPatientsByIds(patients: string[]): Promise<Patient[]> {
    const patientsRes = await this.find({ _id: { $in: patients } }, { _id: 1 });

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

    const patients = await this.aggregate([
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
          foreignField: '_id',
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
                  $in: [
                    {
                      $toString: '$_id',
                    },
                    '$$letGroups',
                  ],
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
  async updatePatient({ user, ...rest }: UpdatePatient, selectors?: string[]): Promise<Patient> {
    const patientRes = await this.findOneAndUpdate(
      { user: new Types.ObjectId(user) },
      { ...rest },
      { projection: selectors || [], new: true },
    );

    return patientRes;
  }
  async updatePatientGroup({ professional, patient, action, patientGroup }: ManagePatientGroupDto): Promise<Patient> {
    const _action = action === ManagePatientGroup.ADD ? { $push: { groups: patientGroup } } : { $pull: { groups: patientGroup } };

    const patientRes = await this.findOneAndUpdate({ _id: patient, professional }, _action, {
      new: true,
      populate: 'groups',
    });

    return patientRes;
  }
  async deleteManyPatientGroup({ professional, patientGroup }: DeleteManyPatientGroup): Promise<UpdateWriteOpResult> {
    const recordsUpdated = await this.updateMany({ professional, groups: patientGroup }, { $pull: { groups: patientGroup } });
    return recordsUpdated;
  }
  async managePatientState({ professional, ...dto }: ManagePatientStateDto, selectors: string[]): Promise<Patient> {
    const patientRes = await this.findOneAndUpdate(
      {
        _id: dto.patient,
        professional: professional,
      },
      { state: dto.state },
      { projection: selectors },
    );

    return patientRes;
  }
}
