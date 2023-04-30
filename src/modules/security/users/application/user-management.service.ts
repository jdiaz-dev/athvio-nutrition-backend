import { UpdatePasswordDto } from './../adapters/in/dtos/update-password.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorUsersEnum } from 'src/shared/enums/messages-response';
import { UsersPersistenceService } from 'src/modules/security/users/adapters/out/users-persistence.service';
import * as bcryptjs from 'bcryptjs';
import { User } from 'src/modules/security/users/adapters/out/user.schema';
import { SignUpUserDto } from 'src/modules/security/users/adapters/in/dtos/sign-up-user.dto';
import { CreateUser, UpdateUser } from 'src/modules/security/users/adapters/out/users-types';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';

@Injectable()
export class UserManagementService {
  constructor(private ups: UsersPersistenceService, private pps: ProfessionalsPersistenceService) {}

  async createUserAndProfessional({ professionalInfo, ...userDto }: SignUpUserDto): Promise<User> {
    const user = await this.ups.getUserByEmail(userDto.email);

    if (user) throw new BadRequestException(ErrorUsersEnum.EMAIL_EXISTS);

    const _professional = {
      ...professionalInfo,
      isTrialPeriod: true,
    };
    const professional = await this.pps.createProfessional(_professional);

    const salt = bcryptjs.genSaltSync();
    const _user: CreateUser = {
      ...userDto,
      password: bcryptjs.hashSync(userDto.password, salt),
      professional: professional._id,
      client: null,
      isProfessional: true,
      isActive: true,
    };
    return this.ups.createUser(_user);
  }
  async createUserAndClient(body: CreateUser): Promise<User> {
    const _user: CreateUser = {
      ...body,
      professional: null,
      isProfessional: false,
      acceptedTerms: false,
      isActive: false,
    };
    const user = await this.ups.createUser(_user);
    return user;
  }

  //only apply when activate client
  async activateUserAndClient({ password, ...rest }: UpdateUser): Promise<User> {
    const salt = bcryptjs.genSaltSync();
    const _user = {
      ...rest,
      password: bcryptjs.hashSync(password, salt),
    };
    const user = await this.ups.updateUser(_user);
    return user;
  }
  async updatePassword({ password, user }: UpdatePasswordDto): Promise<User> {
    const salt = bcryptjs.genSaltSync();
    const _user = {
      user,
      password: bcryptjs.hashSync(password, salt),
    };

    const userUpdated = await this.ups.updateUser(_user);
    return userUpdated;
  }
}
