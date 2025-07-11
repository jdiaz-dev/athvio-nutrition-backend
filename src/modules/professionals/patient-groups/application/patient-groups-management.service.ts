import { Injectable } from '@nestjs/common';
import { PatientManagerService } from 'src/modules/patients/patients/application/patient-manager.service';
import { CreatePatientGroupDto } from 'src/modules/professionals/patient-groups/adapters/in/dtos/create-patient-group.dto';
import { DeletePatientGroupDto } from 'src/modules/professionals/patient-groups/adapters/in/dtos/delete-patient-group.dto';
import { GetPatientGroupsDto } from 'src/modules/professionals/patient-groups/adapters/in/dtos/get-patient-groups.dto';
import { UpdatePatientGroupDto } from 'src/modules/professionals/patient-groups/adapters/in/dtos/update-patient-group.dto';
import { PatientGroup } from 'src/modules/professionals/patient-groups/adapters/out/patient-group.schema';
import { PatientGroupsPersistenceService } from 'src/modules/professionals/patient-groups/adapters/out/patient-groups-persistence.service';

@Injectable()
export class PatientGroupsManagementService {
  constructor(
    private pms: PatientManagerService,
    private cgps: PatientGroupsPersistenceService,
  ) {}

  async createPatientGroup({ professional, ...restDto }: CreatePatientGroupDto): Promise<PatientGroup> {
    const patientGroup = await this.cgps.createPatientGroup({ professional, ...restDto });
    return patientGroup;
  }
  async getPatientGroups({ professional, ...restDto }: GetPatientGroupsDto): Promise<PatientGroup[]> {
    return this.cgps.getPatientGroups({ professional, ...restDto });
  }
  async updatePatientGroup({ professional, ...restDto }: UpdatePatientGroupDto): Promise<PatientGroup> {
    return this.cgps.updatePatientGroup({ professional, ...restDto });
  }
  async deletePatientGroup(dto: DeletePatientGroupDto): Promise<PatientGroup> {
    await this.pms.deleteManyPatientGroup(dto.professional, dto.patientGroup);
    return this.cgps.deletePatientGroup(dto);
  }
}
