import { BadRequestException, Injectable } from '@nestjs/common';
import { GetPatientUserResponse } from 'src/modules/authentication/users/adapters/in/mobile/dtos/get-patient-user-info';
import { UpdateUserDto } from 'src/modules/authentication/users/adapters/in/web/dtos/update-user.dto';
import { User } from 'src/modules/authentication/users/adapters/out/user.schema';
import { UsersPersistenceService } from 'src/modules/authentication/users/adapters/out/users-persistence.service';
import { UpdatePassword, UpdateUser } from 'src/modules/authentication/users/adapters/out/users-types';
import { GetPatientsService } from 'src/modules/patients/patients/application/get-patient.service';
import { ErrorPatientsEnum, ErrorUsersEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class UserManagamentService {
  constructor(private readonly ups: UsersPersistenceService, private readonly gps: GetPatientsService) {}

  async getUserThroughPatient(patient: string): Promise<GetPatientUserResponse> {
    const { user } = await this.gps.getPatientById(patient);
    if (!user) throw new BadRequestException(ErrorPatientsEnum.PATIENT_NOT_FOUND);
    return await this.getUserById(user);
  }
  async updateUser(dto: UpdateUser | UpdatePassword | UpdateUserDto): Promise<User> {
    const patient = await this.ups.updateUser(dto);

    if (patient == null) throw new BadRequestException(ErrorUsersEnum.USER_NOT_FOUND);
    return patient;
  }
  async getUserById(user: string) {
    const _user = await this.ups.getUserById(user);
    if (!_user) throw new BadRequestException(ErrorUsersEnum.USER_NOT_FOUND);
    return _user;
  }
}
