import { BadRequestException, Injectable } from '@nestjs/common';
import { GetPatientUserResponse } from 'src/modules/authentication/users/adapters/in/mobile/dtos/get-patient-user-info';
import { UsersPersistenceService } from 'src/modules/authentication/users/adapters/out/users-persistence.service';
import { GetPatientsService } from 'src/modules/patients/patients/application/get-patient.service';
import { ErrorUsersEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class UserManagamentService {
  constructor(private readonly ups: UsersPersistenceService, private readonly gps: GetPatientsService) {}

  async getUserThroughPatient(patient: string): Promise<GetPatientUserResponse> {
    const { user } = await this.gps.getPatientById(patient);
    if (!user) throw new BadRequestException(ErrorUsersEnum.USER_NOT_FOUND);
    const _user = await this.ups.getUserById(user);
    return _user;
  }
}
