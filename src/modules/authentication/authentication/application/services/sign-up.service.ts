import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorUsersEnum } from 'src/shared/enums/messages-response';
import { UsersPersistenceService } from 'src/modules/authentication/users/adapters/out/users-persistence.service';
import * as bcryptjs from 'bcryptjs';
import { CreateUser } from 'src/modules/authentication/users/adapters/out/users-types';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';
import { SignUpProfessionalDto } from 'src/modules/authentication/authentication/adapters/in/dtos/sign-up-professional.dto';
import { PatientsPersistenceService } from 'src/modules/patients/patients/adapters/out/patients-persistence.service';
import {
  SignUpPatientDto,
  SignUpPatientResponse,
} from 'src/modules/authentication/authentication/adapters/in/dtos/sign-up-patient.dto';
import { AuthenticationService } from 'src/modules/authentication/authentication/application/services/authentication.service';
import { UserLoged } from 'src/modules/authentication/authentication/application/services/auth.types';

@Injectable()
export class SignUpService {
  constructor(
    private ups: UsersPersistenceService,
    private prps: ProfessionalsPersistenceService,
    private pps: PatientsPersistenceService,
    private as: AuthenticationService,
  ) {}

  async signUpProfessional({ professionalInfo, ...userDto }: SignUpProfessionalDto): Promise<UserLoged> {
    const user = await this.ups.getUserByEmail(userDto.email);

    if (user) throw new BadRequestException(ErrorUsersEnum.EMAIL_EXISTS);

    const _professional = await this.prps.createProfessional({
      ...professionalInfo,
      isTrialPeriod: true,
    });

    const salt = bcryptjs.genSaltSync();
    const _user: CreateUser = {
      ...userDto,
      password: bcryptjs.hashSync(userDto.password, salt),
      professional: _professional._id,
      patient: null,
      isProfessional: true,
      isActive: true,
    };
    const { _id, professional, patient, isProfessional } = await this.ups.createUser(_user);
    return this.as.generateToken({ _id, professional, patient, isProfessional });
  }

  async signUpPatient({ professional, userInfo, additionalInfo }: SignUpPatientDto): Promise<SignUpPatientResponse> {
    const userEmail = await this.ups.getUserByEmail(userInfo.email);
    if (userEmail) throw new BadRequestException(ErrorUsersEnum.EMAIL_EXISTS);

    await this.prps.getProfessionalById(professional);

    const patient = await this.pps.createPatient({ professional, ...additionalInfo, isActive: true });
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
    await this.pps.updateUser(patient._id, user._id);

    const _patient = {
      ...patient,
      userInfo: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    };
    return _patient;
  }
}
