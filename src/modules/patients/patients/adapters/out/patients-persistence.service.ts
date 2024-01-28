import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model, UpdateWriteOpResult, Types } from 'mongoose';
import { GetPatientsDto, GetPatientsResponse } from 'src/modules/patients/patients/adapters/in/dtos/get-patients.dto';
import { Patient, PatientDocument } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { ErrorPatientsEnum } from 'src/shared/enums/messages-response';
import { ManagePatientStateDto } from 'src/modules/patients/patients/adapters/in/dtos/manage-patient-state.dto';
import { ManagePatientGroupDto } from 'src/modules/patients/patients/adapters/in/dtos/manage-patient-group.dto';
import { PatientState, ManagePatientGroup } from 'src/shared/enums/project';
import { CreatePatient, DeleteManyPatientGroup, UpdatePatient } from 'src/modules/patients/patients/adapters/out/patient.types';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { searchByFieldsGenerator } from 'src/shared/helpers/mongodb-helpers';

@Injectable()
export class PatientsPersistenceService {
  constructor(@InjectModel(Patient.name) private readonly patientModel: Model<PatientDocument>) {}

  async createPatient({ professional, ...body }: CreatePatient): Promise<FlattenMaps<Patient>> {
    const patient = await this.patientModel.create({
      professional,
      ...body,
    });
    return patient.toJSON();
  }
  async getPatient(professional: string, patient: string): Promise<Patient> {
    const patientRes = await this.patientModel.findOne({
      _id: patient,
      professional: professional,
      state: PatientState.ACTIVE,
    });
    if (!patientRes) throw new BadRequestException(ErrorPatientsEnum.CLIENT_NOT_FOUND);
    return patientRes;
  }
  async getPatientById(patientId: string): Promise<Patient> {
    const patientRes = await this.patientModel.findOne({
      _id: patientId,
      state: PatientState.ACTIVE,
    });
    if (!patientRes) throw new BadRequestException(ErrorPatientsEnum.CLIENT_NOT_FOUND);
    return patientRes;
  }
  async getManyPatientsById(patients: string[]): Promise<Patient[]> {
    const patientsRes = await this.patientModel.find({ _id: { $in: patients } }, { _id: 1 });
    if (patients.length !== patientsRes.length)
      throw new BadRequestException(ErrorPatientsEnum.CLIENTS_TO_SEARCH_ERROR);

    return patientsRes;
  }
  async getPatients({ professional, ...dto }: GetPatientsDto, selectors: Record<string, number>):
    Promise<GetPatientsResponse> {
    const fieldsToSearch = searchByFieldsGenerator(['user.firstName', 'user.lastName'], dto.search);
    const restFields = removeAttributesWithFieldNames(selectors, ['user']);
    const states = dto.state === PatientState.ACTIVE ? [
      { state: dto.state },
      { state: PatientState.INVITATION_PENDING },
    ] : [{ state: PatientState.ARCHIVED }];

    const patients = await this.patientModel.aggregate([
      {
        $match: {
          professional: new Types.ObjectId(professional),
          $or: states
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
          $or: fieldsToSearch,
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
  async updatePatient({ patient, professional, ...rest }: UpdatePatient, selectors: string[]): Promise<Patient> {
    const patientRes = await this.patientModel.findOneAndUpdate(
      { _id: patient, professional },
      { ...rest },
      { projection: selectors, new: true },
    );

    if (patientRes == null) throw new BadRequestException(ErrorPatientsEnum.CLIENT_NOT_FOUND);
    return patientRes;
  }
  async updateUser(patientId: string, userId: string): Promise<Patient> {
    const patientRes = await this.patientModel.findOneAndUpdate({ _id: patientId }, { user: userId }, { new: true });

    if (patientRes == null) throw new BadRequestException(ErrorPatientsEnum.CLIENT_NOT_FOUND);
    return patientRes;
  }
  async updatePatientGroup({ professional, patient, action, patientGroup }: ManagePatientGroupDto): Promise<Patient> {
    const _action = action === ManagePatientGroup.ADD ? { $push: { groups: patientGroup } } : { $pull: { groups: patientGroup } };

    const patientRes = await this.patientModel.findOneAndUpdate({ _id: patient, professional }, _action, {
      new: true,
      populate: 'groups',
    });
    if (patientRes == null) throw new BadRequestException(ErrorPatientsEnum.CLIENT_NOT_FOUND);

    return patientRes;
  }
  async deleteManyPatientGroup({ professional, patientGroup }: DeleteManyPatientGroup): Promise<UpdateWriteOpResult> {
    const recordsUpdated = await this.patientModel.updateMany(
      { professional, groups: patientGroup },
      { $pull: { groups: patientGroup } },
    );
    return recordsUpdated;
  }
  async managePatientState({ professional, ...dto }: ManagePatientStateDto, selectors: string[]): Promise<Patient> {
    const patientRes = await this.patientModel.findOneAndUpdate(
      {
        _id: dto.patient,
        professional: professional,
      },
      { state: dto.state },
      { projection: selectors },
    );

    if (patientRes == null) throw new BadRequestException(ErrorPatientsEnum.CLIENT_NOT_FOUND);

    return patientRes;
  }
}
