import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorPatientsEnum, ErrorUsersEnum } from 'src/shared/enums/messages-response';
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
import { randomBytes } from 'crypto';
import { PatientState } from 'src/shared/enums/project';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { ActivatePatientDto } from 'src/modules/authentication/authentication/adapters/in/dtos/activate-user.dto';

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

    //todo: create user first and then professional
    const _professional = await this.prps.createProfessional({
      user: 'todo: add real user',
      ...professionalInfo,
      isTrialPeriod: true,
    });

    const _user: CreateUser = {
      ...userDto,
      password: this.encryptPassword(user.password),
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
  async activatePatient({ user }: ActivatePatientDto): Promise<Patient> {
    const { _id, isProfessional, isActive, patient } = await this.ups.getUserById(user);

    if (isProfessional) throw new BadRequestException(ErrorPatientsEnum.USER_IS_NOT_PATIENT);
    if (isActive) throw new BadRequestException(ErrorPatientsEnum.USER_ALREADY_ACTIVE);

    const randomPassword = randomBytes(8 / 2).toString('hex');
    await this.ups.updateUser({ user: _id, isActive: true, password: this.encryptPassword(randomPassword) });
    const activatedPatient = await this.pps.updatePatient({ patient, state: PatientState.ACTIVE });
    return activatedPatient;
  }

  private encryptPassword(password: string): string {
    const salt = bcryptjs.genSaltSync();
    return bcryptjs.hashSync(password, salt);
  }
}
