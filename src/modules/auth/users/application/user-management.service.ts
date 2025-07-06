import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { GetPatientUserResponse } from 'src/modules/auth/users/adapters/in/mobile/dtos/get-patient-user-info';
import { UpdateUserDto } from 'src/modules/auth/users/adapters/in/web/dtos/update-user.dto';
import { User } from 'src/modules/auth/users/adapters/out/user.schema';
import { UsersPersistenceService } from 'src/modules/auth/users/adapters/out/users-persistence.service';
import { UpdatePassword, UpdateUser } from 'src/modules/auth/users/adapters/out/users-types';
import { GetPatientManagerService } from 'src/modules/patients/patients/application/get-patient-manager.service';
import { ErrorPatientsEnum, ErrorUsersEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class UserManagamentService {
  constructor(
    private readonly ups: UsersPersistenceService,
    private readonly gps: GetPatientManagerService,
  ) {}

  async getUserThroughPatient(patient: string): Promise<GetPatientUserResponse> {
    const { user } = await this.gps.getPatientById(patient);
    if (!user) throw new BadRequestException(ErrorPatientsEnum.PATIENT_NOT_FOUND);
    return await this.getUserById(user as string);
  }
  async updateUser(dto: UpdateUser | UpdatePassword | UpdateUserDto): Promise<User> {
    const patient = await this.ups.updateUser(dto);

    if (patient == null) throw new BadRequestException(ErrorUsersEnum.USER_NOT_FOUND);
    return patient;
  }
  async getUserById(user: string) {
    const _user = await this.ups.getUserByIdentifier({
      _id: new Types.ObjectId(user),
    });
    if (!_user) throw new BadRequestException(ErrorUsersEnum.USER_NOT_FOUND);
    return _user;
  }
  async getUserByUuid(user: string) {
    const _user = await this.ups.getUserByIdentifier({
      uuid: user,
    });
    if (!_user) throw new BadRequestException(ErrorUsersEnum.USER_NOT_FOUND);
    return _user;
  }
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.ups.getUserByEmail(email);
    return user;
  }
}
