import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorUsersEnum } from 'src/shared/enums/messages-response';
import { UsersPersistenceService } from 'src/modules/authentication/users/adapters/out/users-persistence.service';
import * as bcryptjs from 'bcryptjs';
import { User } from 'src/modules/authentication/users/adapters/out/user.schema';
import { CreateUser } from 'src/modules/authentication/users/adapters/out/users-types';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';
import { SignUpProfessionalDto } from 'src/modules/authentication/authentication/adapters/in/dtos/sign-up-professional.dto';
import { PatientsPersistenceService } from 'src/modules/patients/patients/adapters/out/patients-persistence.service';
import { SignUpPatientDto, SignUpPatientResponse } from 'src/modules/authentication/authentication/adapters/in/dtos/sign-up-patient.dto';

@Injectable()
export class SignUpService {
  constructor(
    private ups: UsersPersistenceService,
    private pps: ProfessionalsPersistenceService,
    private cps: PatientsPersistenceService,
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
      patient: null,
      isProfessional: true,
      isActive: true,
    };
    return this.ups.createUser(_user);
  }

  async signUpPatient({ professional, userInfo, additionalInfo }: SignUpPatientDto): Promise<SignUpPatientResponse> {
    const userEmail = await this.ups.getUserByEmail(userInfo.email);
    if (userEmail) throw new BadRequestException(ErrorUsersEnum.EMAIL_EXISTS);

    await this.pps.getProfessionalById(professional);

    const patient = await this.cps.createPatient({ professional, ...additionalInfo, isActive: true });
    let _user: CreateUser = {
      ...userInfo,
      patient: patient._id,
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
    await this.cps.updateUser(patient._id, user._id);

    const _patient = {
      ...patient,
      userInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
    return _patient;
  }
}
