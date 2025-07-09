import { Injectable } from '@nestjs/common';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { ManagePatientGroupDto } from 'src/modules/patients/patients/adapters/in/web/dtos/manage-patient-group.dto';
import { PatientGroupsPersistenceService } from 'src/modules/professionals/patient-groups/adapters/out/patient-groups-persistence.service';
import { PatientManagementService } from 'src/modules/patients/patients/application/patient-management.service';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';

@Injectable()
export class ManagePatientGroupService {
  constructor(
    private cgps: PatientGroupsPersistenceService,
    private pms: PatientManagementService,
    private prms: ProfessionalsManagementService,
  ) {}

  async managePatientGroup(dto: ManagePatientGroupDto): Promise<Patient> {
    await this.prms.getProfessionalByUuid(dto.professional, { _id: 1 });
    await this.cgps.getPatientGroup(dto.professional, dto.patientGroup);
    const patient = await this.pms.updatePatientGroup(dto);
    return patient;
  }
}
