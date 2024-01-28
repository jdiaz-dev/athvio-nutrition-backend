import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePatientGroupDto } from 'src/modules/professionals/patient-groups/adapters/in/dtos/create-patient-group.dto';
import { DeletePatientGroupDto } from 'src/modules/professionals/patient-groups/adapters/in/dtos/delete-patient-group.dto';
import { GetPatientGroupsDto } from 'src/modules/professionals/patient-groups/adapters/in/dtos/get-patient-groups.dto';
import { UpdatePatientGroupDto } from 'src/modules/professionals/patient-groups/adapters/in/dtos/update-patient-group.dto';
import { PatientGroup, PatientGroupDocument } from 'src/modules/professionals/patient-groups/adapters/out/patient-group.schema';
import { ErrorPatientGroupEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class PatientGroupsPersistenceService {
  constructor(@InjectModel(PatientGroup.name) private readonly programTagModel: Model<PatientGroupDocument>) {}

  async createPatientGroup({ professional, ...rest }: CreatePatientGroupDto): Promise<PatientGroup> {
    const patientGroup = await this.programTagModel.create({
      professional,
      ...rest,
    });
    return patientGroup;
  }
  async getPatientGroup(professionalId: string, groupId: string): Promise<PatientGroup> {
    const patientGroup = await this.programTagModel.findOne({
      _id: groupId,
      professional: professionalId,
      isDeleted: false,
    });

    if (patientGroup == null) throw new BadRequestException(ErrorPatientGroupEnum.CLIENT_GROUP_NOT_FOUND);

    return patientGroup;
  }
  async getPatientGroups({ professional }: GetPatientGroupsDto): Promise<PatientGroup[]> {
    const patientGroups = await this.programTagModel.find({
      professional,
      isDeleted: false,
    });
    return patientGroups;
  }
  async updatePatientGroup({ professional, patientGroup, ...rest }: UpdatePatientGroupDto): Promise<PatientGroup> {
    const patientGroupRes = await this.programTagModel.findOneAndUpdate(
      { _id: patientGroup, professional, isDeleted: false },
      { ...rest },
      { new: true },
    );

    if (patientGroup == null) throw new BadRequestException(ErrorPatientGroupEnum.CLIENT_GROUP_NOT_FOUND);
    return patientGroupRes;
  }

  async deletePatientGroup({ professional, patientGroup }: DeletePatientGroupDto): Promise<PatientGroup> {
    const patientGroupRes = await this.programTagModel.findOneAndUpdate(
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
