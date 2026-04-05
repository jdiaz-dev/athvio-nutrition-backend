import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthorizationModulesService } from 'src/modules/auth/auth/application/services/authorization-modules.service';
import { PatientsPersistenceService } from 'src/modules/patients/patients/adapters/out/patients-persistence.service';
import { ErrorPatientsEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class GetPatientForMobileService {
  constructor(
    private readonly pps: PatientsPersistenceService,
    private readonly ams: AuthorizationModulesService,
  ) {}
  async getPatientForMobile(patient: string, selectors?: Record<string, number>) {
    const _patient = await this.pps.getPatientPopulatedWithUser({ uuid: patient }, selectors || { _id: 1 });

    if (!_patient) throw new BadRequestException(ErrorPatientsEnum.PATIENT_NOT_FOUND);
    return { ..._patient, ...this.ams.getPatientModuleAccess(_patient.professional) };
  }
}
