import { Injectable } from '@nestjs/common';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { ManagePatientGroupDto } from 'src/modules/patients/patients/adapters/in/web/dtos/manage-patient-group.dto';
import { PatientGroupsPersistenceService } from 'src/modules/professionals/patient-groups/adapters/out/patient-groups-persistence.service';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';
import { PatientManagementService } from 'src/modules/patients/patients/application/patient-management.service';

@Injectable()
export class ManagePatientGroupService {
  constructor(
    private cgps: PatientGroupsPersistenceService,
    private pms: PatientManagementService,
    private pps: ProfessionalsPersistenceService,
  ) {}

  async managePatientGroup(dto: ManagePatientGroupDto): Promise<Patient> {
    await this.pps.getProfessionalById(dto.professional, { _id: 1 });
    await this.cgps.getPatientGroup(dto.professional, dto.patientGroup);
    const patient = await this.pms.updatePatientGroup(dto);
    return patient;
  }
}
