import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model, UpdateWriteOpResult, Types } from 'mongoose';
import { GetPatientsDto, GetPatientsResponse } from 'src/modules/patients/patients/adapters/in/web/dtos/get-patients.dto';
import { Patient, PatientDocument } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { InternalErrors } from 'src/shared/enums/messages-response';
import { ManagePatientStateDto } from 'src/modules/patients/patients/adapters/in/web/dtos/manage-patient-state.dto';
import { ManagePatientGroupDto } from 'src/modules/patients/patients/adapters/in/web/dtos/manage-patient-group.dto';
import { PatientState, ManagePatientGroup, LayersServer } from 'src/shared/enums/project';
import { CreatePatient, DeleteManyPatientGroup, UpdatePatient } from 'src/modules/patients/patients/adapters/out/patient.types';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { searchByFieldsGenerator } from 'src/shared/helpers/mongodb-helpers';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';

//todo: add loggers to log internal errors
@Injectable()
export class PatientsPersistenceService {
  constructor(
    @InjectModel(Patient.name) private readonly patientModel: Model<PatientDocument>,
    private readonly logger: AthvioLoggerService,
  ) {}

  async createPatient({ professional, ...body }: CreatePatient): Promise<FlattenMaps<Patient>> {
    try {
      const patient = await this.patientModel.create({
        professional,
        ...body,
      });
      return patient.toJSON();
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async getPatient(filters: Record<string, string>, selectors: Record<string, number>): Promise<Patient> {
    const restFields = removeAttributesWithFieldNames(selectors, ['user']);

    let mappedFilters: any = {};
    for (let filter in filters) {
      mappedFilters[filter] = new Types.ObjectId(filters[filter]);
    }

    try {
      const patientRes = await this.patientModel.aggregate([
        {
          $match: { ...mappedFilters },
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
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async getPatientById(patientId: string): Promise<Patient> {
    try {
      const patientRes = await this.patientModel.findOne({
        _id: patientId,
      });

      return patientRes;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
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
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async getManyPatientsByIds(patients: string[]): Promise<Patient[]> {
    try {
      const patientsRes = await this.patientModel.find({ _id: { $in: patients } }, { _id: 1 });

      return patientsRes;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
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
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
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

      return patientRes;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
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

      return patientRes;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
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
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
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

      return patientRes;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
}
