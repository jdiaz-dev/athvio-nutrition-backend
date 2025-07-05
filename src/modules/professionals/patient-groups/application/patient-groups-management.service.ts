import { Injectable } from '@nestjs/common';
import { PatientManagementService } from 'src/modules/patients/patients/application/patient-management.service';
import { CreatePatientGroupDto } from 'src/modules/professionals/patient-groups/adapters/in/dtos/create-patient-group.dto';
import { DeletePatientGroupDto } from 'src/modules/professionals/patient-groups/adapters/in/dtos/delete-patient-group.dto';
import { GetPatientGroupsDto } from 'src/modules/professionals/patient-groups/adapters/in/dtos/get-patient-groups.dto';
import { UpdatePatientGroupDto } from 'src/modules/professionals/patient-groups/adapters/in/dtos/update-patient-group.dto';
import { PatientGroup } from 'src/modules/professionals/patient-groups/adapters/out/patient-group.schema';
import { PatientGroupsPersistenceService } from 'src/modules/professionals/patient-groups/adapters/out/patient-groups-persistence.service';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';

@Injectable()
export class PatientGroupsManagementService {
  constructor(
    private pms: PatientManagementService,
    private cgps: PatientGroupsPersistenceService,
    private prms: ProfessionalsManagementService,
  ) {}

  async createPatientGroup({ professional, ...restDto }: CreatePatientGroupDto): Promise<PatientGroup> {
    const { _id } = await this.prms.getProfessionalByUuid(professional, { _id: 1 });
    const patientGroup = await this.cgps.createPatientGroup({ professional: _id.toString(), ...restDto });

    return patientGroup;
  }
  async getPatientGroups({ professional, ...restDto }: GetPatientGroupsDto): Promise<PatientGroup[]> {
    const { _id } = await this.prms.getProfessionalByUuid(professional, { _id: 1 });
    return this.cgps.getPatientGroups({ professional: _id.toString(), ...restDto });
  }
  async updatePatientGroup({ professional, ...restDto }: UpdatePatientGroupDto): Promise<PatientGroup> {
    const { _id } = await this.prms.getProfessionalByUuid(professional, { _id: 1 });
    return this.cgps.updatePatientGroup({ professional: _id.toString(), ...restDto });
  }
  async deletePatientGroup(dto: DeletePatientGroupDto): Promise<PatientGroup> {
    await this.pms.deleteManyPatientGroup(dto.professional, dto.patientGroup);
    return this.cgps.deletePatientGroup(dto);
  }
}
