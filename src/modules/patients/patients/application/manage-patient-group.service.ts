import { Injectable } from '@nestjs/common';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { ManagePatientGroupDto } from 'src/modules/patients/patients/adapters/in/dtos/manage-patient-group.dto';
import { PatientsPersistenceService } from 'src/modules/patients/patients/adapters/out/patients-persistence.service';
import { PatientGroupsPersistenceService } from 'src/modules/professionals/patient-groups/adapters/out/patient-groups-persistence.service';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';

@Injectable()
export class ManagePatientGroupService {
  constructor(
    private cgps: PatientGroupsPersistenceService,
    private cps: PatientsPersistenceService,
    private pps: ProfessionalsPersistenceService,
  ) {}

  async managePatientGroup(dto: ManagePatientGroupDto): Promise<Patient> {
    await this.pps.getProfessionalById(dto.professional, { _id: 1 });
    await this.cgps.getPatientGroup(dto.professional, dto.patientGroup);
    const patient = await this.cps.updatePatientGroup(dto);
    return patient;
  }
}
