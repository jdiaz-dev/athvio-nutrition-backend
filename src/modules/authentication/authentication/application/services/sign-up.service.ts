import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorUsersEnum } from 'src/shared/enums/messages-response';
import { UsersPersistenceService } from 'src/modules/authentication/users/adapters/out/users-persistence.service';
import * as bcryptjs from 'bcryptjs';
import { User } from 'src/modules/authentication/users/adapters/out/user.schema';
import { CreateUser } from 'src/modules/authentication/users/adapters/out/users-types';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';
import { SignUpProfessionalDto } from 'src/modules/authentication/authentication/adapters/in/dtos/sign-up-professional.dto';
import { SignUpClientDto, SignUpClientResponse } from 'src/modules/authentication/authentication/adapters/in/dtos/sign-up-client.dto';
import { ClientsPersistenceService } from 'src/modules/clients/clients/adapters/out/clients-persistence.service';

@Injectable()
export class SignUpService {
  constructor(
    private ups: UsersPersistenceService,
    private pps: ProfessionalsPersistenceService,
    private cps: ClientsPersistenceService,
  ) {}

  async signUpProfessional({ professionalInfo, ...userDto }: SignUpProfessionalDto): Promise<User> {
    const user = await this.ups.getUserByEmail(userDto.email);

    if (user) throw new BadRequestException(ErrorUsersEnum.EMAIL_EXISTS);

    const professional = await this.pps.createProfessional({
      ...professionalInfo,
      isTrialPeriod: true,
    });

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

  async signUpClient({ professional, userInfo, additionalInfo }: SignUpClientDto): Promise<SignUpClientResponse> {
    const userEmail = await this.ups.getUserByEmail(userInfo.email);
    if (userEmail) throw new BadRequestException(ErrorUsersEnum.EMAIL_EXISTS);

    await this.pps.getProfessionalById(professional);

    const client = await this.cps.createClient({ professional, ...additionalInfo, isActive: true });
    let _user: CreateUser = {
      ...userInfo,
      client: client._id,
    };

    if (additionalInfo.countryCode) _user.countryCode = additionalInfo.countryCode;
    if (additionalInfo.country) _user.country = additionalInfo.country;

     _user = {
      ..._user,
      professional: null,
      isProfessional: false,
      acceptedTerms: false,
      isActive: false,
    };
    const user = await this.ups.createUser(_user);
    await this.cps.updateUser(client._id, user._id);

    const _client = {
      ...client,
      userInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
    return _client;
  }
}
