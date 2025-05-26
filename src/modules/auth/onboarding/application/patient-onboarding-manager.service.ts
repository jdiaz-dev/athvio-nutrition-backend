import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignUpPatientFromMobileDto } from 'src/modules/auth/auth/adapters/in/mobile/dtos/sign-up-patient-from-mobile.dto';
import { SignUpPatientDto, SignUpPatientResponse } from 'src/modules/auth/auth/adapters/in/web/dtos/sign-up-patient.dto';
import { EncryptionService } from 'src/modules/auth/auth/application/services/encryption.service';
import { UsersPersistenceService } from 'src/modules/auth/users/adapters/out/users-persistence.service';
import { CreateUser } from 'src/modules/auth/users/adapters/out/users-types';
import { UserManagamentService } from 'src/modules/auth/users/application/user-management.service';
import { MailService } from 'src/modules/mail/adapters/out/mail.service';
import { PatientManagementService } from 'src/modules/patients/patients/application/patient-management.service';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';
import { ProfessionalQuestionaryManager } from 'src/modules/questionaries/professional-questionaries/application/profesional-questionary-manager.service';
import { PatientQuestionaryManagerService } from 'src/modules/questionaries/patient-questionaries/application/patient-questionary-manager.service';
import { ErrorUsersEnum, ProfessionalMessages } from 'src/shared/enums/messages-response';
import { EnumRoles, LayersServer, OriginPatientEnum, PatientState } from 'src/shared/enums/project';

@Injectable()
export class PatientOnboardingManagerService {
  private layer = LayersServer.APPLICATION;

  constructor(
    private readonly configService: ConfigService,
    private prms: ProfessionalsManagementService,
    private ups: UsersPersistenceService,
    private readonly pms: PatientManagementService,
    private readonly ums: UserManagamentService,
    private readonly ms: MailService,
    private readonly qcm: ProfessionalQuestionaryManager,
    private readonly pqms: PatientQuestionaryManagerService,
  ) {}
  async onboardingForWeb(
    { professional, userInfo, additionalInfo }: SignUpPatientDto,
    isPatientDemo: boolean = false,
  ): Promise<SignUpPatientResponse> {
    const userEmail = await this.ups.getUserByEmail(userInfo.email);
    if (userEmail) throw new BadRequestException(ErrorUsersEnum.EMAIL_EXISTS, this.layer);

    const _proffesional = await this.prms.getProfessionalById(professional);
    if (!_proffesional) throw new BadRequestException(ProfessionalMessages.PROFESSIONAL_NOT_FOUND, this.layer);

    let _user: CreateUser = {
      ...userInfo,
    };

    if (additionalInfo?.countryCode) _user.countryCode = additionalInfo.countryCode;
    if (additionalInfo?.country) _user.country = additionalInfo.country;

    _user = {
      ..._user,
      role: EnumRoles.PATIENT,
      acceptedTerms: false,
      isActive: false,
    };
    const { _id, firstname, lastname, email } = await this.ups.createUser(_user);

    const patient = await this.pms.createPatient({
      professional,
      user: _id,
      ...additionalInfo,
      origin: OriginPatientEnum.WEB,
      isActive: true,
    });

    const { questionaryGroups } = await this.qcm.getProfessionalQuestionary(professional);
    await this.pqms.createQuestionary({
      patient: patient._id,
      professional: _proffesional._id,
      questionaryGroups: questionaryGroups.map(({ _id, questionaryDetails, ...restGroup }) => ({
        ...restGroup,
        questionaryDetails: questionaryDetails.map(({ _id, ...rest }) => ({ ...rest })),
      })),
    });

    if (!isPatientDemo) await this.sendMail(_proffesional.user._id.toString(), _id, email, firstname);
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
  async onboardingForMobile({ ...userDto }: SignUpPatientFromMobileDto): Promise<{ user: string; role: EnumRoles }> {
    const user = await this.ups.getUserByEmail(userDto.email);
    if (user) throw new BadRequestException(ErrorUsersEnum.EMAIL_EXISTS, this.layer);

    const _user: CreateUser = {
      ...userDto,
      password: EncryptionService.encrypt(userDto.password),
      role: EnumRoles.PATIENT,
      isActive: true,
    };
    const { _id, role } = await this.ups.createUser(_user);

    await this.pms.createPatient({
      user: _id,
      isActive: true,
      origin: OriginPatientEnum.MOBILE,
      state: PatientState.ACTIVE,
    });

    return { user: _id, role };
  }
  private async sendMail(
    proffesionalUser: string,
    patientUserId: string,
    patientEmail: string,
    patientFirstname: string,
  ): Promise<void> {
    const { firstname: professionalFirstname, lastname: professionalLastname } = await this.ums.getUserById(proffesionalUser);
    const origin = this.configService.get<string[]>('whiteListOrigins')[0];
    const url = `${origin}/activate/${patientUserId}`;
    const mailTitle = `Invitation from ${professionalFirstname} ${professionalLastname}`;
    const message = `
      Hello ${patientFirstname},

      I'm inviting you to use Athvio. It will help to receive your nutritional plans and chat with me!
      
      - Your Coach,
      ${professionalFirstname} ${professionalLastname}
      ${url}
    `;
    await this.ms.sendEmail({
      from: this.configService.get<string>('mailsSender'),
      to: [patientEmail],
      subject: mailTitle,
      message,
    });
  }
}
