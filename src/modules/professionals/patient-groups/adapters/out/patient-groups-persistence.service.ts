import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { CreatePatientGroupDto } from 'src/modules/professionals/patient-groups/adapters/in/dtos/create-patient-group.dto';
import { DeletePatientGroupDto } from 'src/modules/professionals/patient-groups/adapters/in/dtos/delete-patient-group.dto';
import { GetPatientGroupsDto } from 'src/modules/professionals/patient-groups/adapters/in/dtos/get-patient-groups.dto';
import { UpdatePatientGroupDto } from 'src/modules/professionals/patient-groups/adapters/in/dtos/update-patient-group.dto';
import { PatientGroup, PatientGroupDocument } from 'src/modules/professionals/patient-groups/adapters/out/patient-group.schema';
import { MongodbQueryBuilder } from 'src/shared/database/mongodb-query-builder';
import { ErrorPatientGroupEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class PatientGroupsPersistenceService extends MongodbQueryBuilder<PatientGroupDocument> {
  constructor(
    @InjectModel(PatientGroup.name) protected readonly programTagModel: Model<PatientGroupDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(programTagModel, logger, PatientGroup.name);
  }

  async createPatientGroup({ professional, ...rest }: CreatePatientGroupDto): Promise<PatientGroup> {
    const patientGroup = await this.initializeQuery(this.createPatientGroup.name).create({
      professional,
      ...rest,
    });
    return patientGroup;
  }
  async getPatientGroup(professionalId: string, groupId: string): Promise<PatientGroup> {
    const patientGroup = await this.initializeQuery(this.getPatientGroup.name).findOne({
      _id: groupId,
      professional: professionalId,
      isDeleted: false,
    });

    if (patientGroup == null) throw new BadRequestException(ErrorPatientGroupEnum.CLIENT_GROUP_NOT_FOUND);

    return patientGroup;
  }
  async getPatientGroups({ professional }: GetPatientGroupsDto): Promise<PatientGroup[]> {
    const patientGroups = await this.initializeQuery(this.getPatientGroups.name).find({
      professional,
      isDeleted: false,
    });
    return patientGroups;
  }
  async updatePatientGroup({ professional, patientGroup, ...rest }: UpdatePatientGroupDto): Promise<PatientGroup> {
    const patientGroupRes = await this.initializeQuery(this.updatePatientGroup.name).findOneAndUpdate(
      { _id: patientGroup, professional, isDeleted: false },
      { ...rest },
      { new: true },
    );

    if (patientGroup == null) throw new BadRequestException(ErrorPatientGroupEnum.CLIENT_GROUP_NOT_FOUND);
    return patientGroupRes;
  }

  async deletePatientGroup({ professional, patientGroup }: DeletePatientGroupDto): Promise<PatientGroup> {
    const patientGroupRes = await this.initializeQuery(this.deletePatientGroup.name).findOneAndUpdate(
      {
        _id: patientGroup,
        professional,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        new: true,
      },
    );

    if (patientGroupRes == null) throw new BadRequestException(ErrorPatientGroupEnum.CLIENT_GROUP_NOT_FOUND);

    return patientGroupRes;
  }
}
