import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model, UpdateWriteOpResult, Types } from 'mongoose';
import { GetPatientsDto, GetPatientsResponse } from 'src/modules/patients/patients/adapters/in/dtos/get-patients.dto';
import { Patient, PatientDocument } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { ErrorPatientsEnum, InternalErrors } from 'src/shared/enums/messages-response';
import { ManagePatientStateDto } from 'src/modules/patients/patients/adapters/in/dtos/manage-patient-state.dto';
import { ManagePatientGroupDto } from 'src/modules/patients/patients/adapters/in/dtos/manage-patient-group.dto';
import { PatientState, ManagePatientGroup } from 'src/shared/enums/project';
import { CreatePatient, DeleteManyPatientGroup, UpdatePatient } from 'src/modules/patients/patients/adapters/out/patient.types';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { searchByFieldsGenerator } from 'src/shared/helpers/mongodb-helpers';

//todo: move all badRequestExceptions to application layer
//todo: add loggers to log internal errors
@Injectable()
export class PatientsPersistenceService {
  constructor(@InjectModel(Patient.name) private readonly patientModel: Model<PatientDocument>) {}

  async createPatient({ professional, ...body }: CreatePatient): Promise<FlattenMaps<Patient>> {
    try {
      const patient = await this.patientModel.create({
        professional,
        ...body,
      });
      return patient.toJSON();
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async getPatient(professional: string, patient: string, selectors: Record<string, number>): Promise<Patient> {

    try {
      const restFields = removeAttributesWithFieldNames(selectors, ['user']);

      const patientRes = await this.patientModel.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(patient),
            professional: new Types.ObjectId(professional),
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
          $project: {
            // to get user as object instead of array
            user: {
              $arrayElemAt: ['$user', 0],
            },
            ...restFields,
          },
        },
        {
          $project: selectors,
        },
      ]);

      return patientRes[0];
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async getPatientById(patientId: string): Promise<Patient> {
    try {
      const patientRes = await this.patientModel.findOne({
        _id: patientId,
        state: PatientState.ACTIVE,
      });
      if (!patientRes) throw new BadRequestException(ErrorPatientsEnum.PATIENT_NOT_FOUND);
      return patientRes;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async getPatientByUser(user: string): Promise<Patient> {
    try {
      const patientRes = await this.patientModel.findOne({
        user,
        state: PatientState.ACTIVE,
      });
      return patientRes;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async getManyPatientsById(patients: string[]): Promise<Patient[]> {
    try {
      const patientsRes = await this.patientModel.find({ _id: { $in: patients } }, { _id: 1 });
      if (patients.length !== patientsRes.length) throw new BadRequestException(ErrorPatientsEnum.CLIENTS_TO_SEARCH_ERROR);

      return patientsRes;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async getPatients({ professional, ...dto }: GetPatientsDto, selectors: Record<string, number>): Promise<GetPatientsResponse> {
    try {
      const combinedFields = searchByFieldsGenerator(['user.firstname', 'user.lastname'], dto.search);
      const restFields = removeAttributesWithFieldNames(selectors, ['user']);

      //todo: move this conditional to application layer
      const states =
        dto.state === PatientState.ACTIVE
          ? [{ state: dto.state }, { state: PatientState.INVITATION_PENDING }]
          : [{ state: PatientState.ARCHIVED }];

      const patients = await this.patientModel.aggregate([
        {
          $match: {
            professional: new Types.ObjectId(professional),
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
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async updatePatient({ user, ...rest }: UpdatePatient, selectors?: string[]): Promise<Patient> {
    try {
      const patientRes = await this.patientModel.findOneAndUpdate(
        { user: new Types.ObjectId(user) },
        { ...rest },
        { projection: selectors || [], new: true },
      );

      if (patientRes == null) throw new BadRequestException(ErrorPatientsEnum.PATIENT_NOT_FOUND);
      return patientRes;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  //todo: check where is used this method
  async updateUser(patientId: string, userId: string): Promise<Patient> {
    try {
      const patientRes = await this.patientModel.findOneAndUpdate({ _id: patientId }, { user: userId }, { new: true });

      if (patientRes == null) throw new BadRequestException(ErrorPatientsEnum.PATIENT_NOT_FOUND);
      return patientRes;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async updatePatientGroup({ professional, patient, action, patientGroup }: ManagePatientGroupDto): Promise<Patient> {
    try {
      const _action =
        action === ManagePatientGroup.ADD ? { $push: { groups: patientGroup } } : { $pull: { groups: patientGroup } };

      const patientRes = await this.patientModel.findOneAndUpdate({ _id: patient, professional }, _action, {
        new: true,
        populate: 'groups',
      });
      if (patientRes == null) throw new BadRequestException(ErrorPatientsEnum.PATIENT_NOT_FOUND);

      return patientRes;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async deleteManyPatientGroup({ professional, patientGroup }: DeleteManyPatientGroup): Promise<UpdateWriteOpResult> {
    try {
      const recordsUpdated = await this.patientModel.updateMany(
        { professional, groups: patientGroup },
        { $pull: { groups: patientGroup } },
      );
      return recordsUpdated;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async managePatientState({ professional, ...dto }: ManagePatientStateDto, selectors: string[]): Promise<Patient> {
    try {
      const patientRes = await this.patientModel.findOneAndUpdate(
        {
          _id: dto.patient,
          professional: professional,
        },
        { state: dto.state },
        { projection: selectors },
      );

      if (patientRes == null) throw new BadRequestException(ErrorPatientsEnum.PATIENT_NOT_FOUND);

      return patientRes;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
}
