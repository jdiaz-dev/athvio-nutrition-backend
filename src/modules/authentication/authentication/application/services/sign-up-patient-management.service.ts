import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorPatientsEnum, ErrorUsersEnum, ProfessionalMessages } from 'src/shared/enums/messages-response';
import { UsersPersistenceService } from 'src/modules/authentication/users/adapters/out/users-persistence.service';
import { CreateUser } from 'src/modules/authentication/users/adapters/out/users-types';
import {
  SignUpPatientDto,
  SignUpPatientResponse,
} from 'src/modules/authentication/authentication/adapters/in/dtos/sign-up-patient.dto';
import { EnumRoles, LayersServer, PatientState } from 'src/shared/enums/project';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { ActivatePatientDto } from 'src/modules/authentication/authentication/adapters/in/dtos/activate-user.dto';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';
import { PatientManagementService } from 'src/modules/patients/patients/application/patient-management.service';
import { MailService } from 'src/modules/mail/adapters/out/mail.service';
import { EncryptionService } from 'src/modules/authentication/authentication/application/services/encryption.service';

@Injectable()
export class SignUpPatientManagamentService {
  private layer = LayersServer.APPLICATION;
  constructor(
    private ups: UsersPersistenceService,
    private prms: ProfessionalsManagementService,
    private pms: PatientManagementService,
    private ms: MailService,
  ) {}

  async signUpPatient({ professional, userInfo, additionalInfo }: SignUpPatientDto): Promise<SignUpPatientResponse> {
    const userEmail = await this.ups.getUserByEmail(userInfo.email);
    if (userEmail) throw new BadRequestException(ErrorUsersEnum.EMAIL_EXISTS, this.layer);

    const _proffesional = await this.prms.getProfessionalById(professional);
    console.log('-------_proffesional.user', _proffesional.user);
    if (!_proffesional) throw new BadRequestException(ProfessionalMessages.PROFESSIONAL_NOT_FOUND, this.layer);

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

    const patient = await this.pms.createPatient({ professional, user: _id, ...additionalInfo, isActive: true });
    await this.sendMail(_proffesional.user._id.toString(), _id, email, firstname);
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
  async activatePatient({ user, password }: ActivatePatientDto): Promise<Patient> {
    const { _id, role, isActive } = await this.ups.getUserById(user);

    if (role !== EnumRoles.PATIENT) throw new BadRequestException(ErrorPatientsEnum.USER_IS_NOT_PATIENT, this.layer);
    if (isActive) throw new BadRequestException(ErrorPatientsEnum.USER_ALREADY_ACTIVE);

    await this.ups.updateUser({ user: _id, isActive: true, password: EncryptionService.encrypt(password) });
    const activatedPatient = await this.pms.updatePatient({ user: _id, state: PatientState.ACTIVE });
    return activatedPatient;
  }
  private async sendMail(
    proffesionalUser: string,
    patientUserId: string,
    patientEmail: string,
    patientFirstname: string,
  ): Promise<void> {
    const {
      email: professionalEmail,
      firstname: professionalFirstname,
      lastname: professionalLastname,
    } = await this.ups.getUserById(proffesionalUser);
    const url = `http://localhost:4200/invitation/${patientUserId}`;
    const mailTitle = `Invitation from ${professionalFirstname} ${professionalLastname}`;
    const message = `
      Hello ${patientFirstname},

      I'm inviting you to use Athvio. It will help to receive your nutritional plans and chat with me!
      
      - Your Coach,
      ${professionalFirstname} ${professionalLastname}
      ${url}
    `;
    await this.ms.sendEmail({
      from: professionalEmail,
      to: [patientEmail],
      subject: mailTitle,
      message,
    });
  }
}
