import { Injectable } from '@nestjs/common';
import { PatientManagementService } from 'src/modules/patients/patients/application/patient-management.service';
import { CreatePatientGroupDto } from 'src/modules/professionals/patient-groups/adapters/in/dtos/create-patient-group.dto';
import { DeletePatientGroupDto } from 'src/modules/professionals/patient-groups/adapters/in/dtos/delete-patient-group.dto';
import { PatientGroup } from 'src/modules/professionals/patient-groups/adapters/out/patient-group.schema';
import { PatientGroupsPersistenceService } from 'src/modules/professionals/patient-groups/adapters/out/patient-groups-persistence.service';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';

@Injectable()
export class PatientGroupsManagementService {
  constructor(
    private pms: PatientManagementService,
    private cgps: PatientGroupsPersistenceService,
    private pps: ProfessionalsPersistenceService,
  ) {}

  async createPatientGroup(dto: CreatePatientGroupDto): Promise<PatientGroup> {
    await this.pps.getProfessionalById(dto.professional, { _id: 1 });
    const patientGroup = await this.cgps.createPatientGroup(dto);

    return patientGroup;
  }
  async deletePatientGroup(dto: DeletePatientGroupDto): Promise<PatientGroup> {
    await this.pms.deleteManyPatientGroup(dto.professional, dto.patientGroup);
    return this.cgps.deletePatientGroup(dto);
  }
}
