import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorPatientsEnum, ErrorUsersEnum, ProfessionalMessages } from 'src/shared/enums/messages-response';
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
import { EnumRoles, LayersApplication, PatientState } from 'src/shared/enums/project';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { ActivatePatientDto } from 'src/modules/authentication/authentication/adapters/in/dtos/activate-user.dto';

@Injectable()
export class SignUpService {
  private errorDetail = LayersApplication.APPLICATION;
  constructor(
    private ups: UsersPersistenceService,
    private prps: ProfessionalsPersistenceService,
    private pps: PatientsPersistenceService,
    private as: AuthenticationService,
  ) {}

  async signUpProfessional({ professionalInfo, ...userDto }: SignUpProfessionalDto): Promise<UserLoged> {
    const user = await this.ups.getUserByEmail(userDto.email);
    if (user) throw new BadRequestException(ErrorUsersEnum.EMAIL_EXISTS, this.errorDetail);

    const _user: CreateUser = {
      ...userDto,
      password: this.encryptPassword(userDto.password),
      role: EnumRoles.PROFESSIONAL,
      isActive: true,
    };
    const { _id, role } = await this.ups.createUser(_user);

    await this.prps.createProfessional({
      user: _id,
      ...professionalInfo,
      isTrialPeriod: true,
    });
    return this.as.generateToken({ _id, role });
  }

  async signUpPatient({ professional, userInfo, additionalInfo }: SignUpPatientDto): Promise<SignUpPatientResponse> {
    const userEmail = await this.ups.getUserByEmail(userInfo.email);
    if (userEmail) throw new BadRequestException(ErrorUsersEnum.EMAIL_EXISTS, this.errorDetail);

    const prof = await this.prps.getProfessionalById(professional, { _id: 1 });
    if (!prof) throw new BadRequestException(ProfessionalMessages.PROFESSIONAL_NOT_FOUND, this.errorDetail);

    let _user: CreateUser = {
      ...userInfo,
    };

    if (additionalInfo.countryCode) _user.countryCode = additionalInfo.countryCode;
    if (additionalInfo.country) _user.country = additionalInfo.country;

    _user = {
      ..._user,
      role: EnumRoles.PATIENT,
      acceptedTerms: false,
      isActive: false,
    };
    const { _id, firstname, lastname, email } = await this.ups.createUser(_user);

    //todo: remove it
    // await this.pps.updateUser(patient._id, user._id);
    const patient = await this.pps.createPatient({ professional, user: _id, ...additionalInfo, isActive: true });

    const _patient = {
      ...patient,
      userInfo: {
        firstname: firstname,
        lastname: lastname,
        email: email,
      },
    };
    return _patient;
  }
  async activatePatient({ user }: ActivatePatientDto): Promise<Patient> {
    const { _id, role, isActive } = await this.ups.getUserById(user);

    if (role !== EnumRoles.PATIENT) throw new BadRequestException(ErrorPatientsEnum.USER_IS_NOT_PATIENT, this.errorDetail);
    if (isActive) throw new BadRequestException(ErrorPatientsEnum.USER_ALREADY_ACTIVE);

    const randomPassword = randomBytes(8 / 2).toString('hex');
    await this.ups.updateUser({ user: _id, isActive: true, password: this.encryptPassword(randomPassword) });
    const activatedPatient = await this.pps.updatePatient({ user: _id, state: PatientState.ACTIVE });
    return activatedPatient;
  }

  private encryptPassword(password: string): string {
    const salt = bcryptjs.genSaltSync();
    return bcryptjs.hashSync(password, salt);
  }
}
