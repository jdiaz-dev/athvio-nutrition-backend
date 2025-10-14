import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignUpPatientFromMobileDto } from 'src/modules/auth/auth/adapters/in/mobile/dtos/sign-up-patient-from-mobile.dto';
import { SignUpPatientDto, SignUpPatientResponse } from 'src/modules/auth/auth/adapters/in/web/dtos/sign-up-patient.dto';
import { EncryptionService } from 'src/modules/auth/auth/application/services/encryption.service';
import { UserManagamentService } from 'src/modules/auth/users/application/user-management.service';
import { MailService } from 'src/modules/mail/adapters/out/mail.service';
import { PatientManagerService } from 'src/modules/patients/patients/application/patient-manager.service';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';
import { ProfessionalQuestionaryManager } from 'src/modules/professionals/professional-questionaries/application/profesional-questionary-manager.service';
import { PatientQuestionaryManagerService } from 'src/modules/patients/patient-questionaries/application/patient-questionary-manager.service';
import { ErrorUsersEnum, ProfessionalMessages } from 'src/shared/enums/messages-response';
import { LayersServer, OriginPatientEnum, PatientState } from 'src/shared/enums/project';
import { CreateUserService } from 'src/modules/auth/users/application/create-user.service';
import { UserValidated } from 'src/modules/auth/auth/application/ports/in/validate-user.use-case';

@Injectable()
export class PatientOnboardingManagerService {
  private layer = LayersServer.APPLICATION;

  constructor(
    private readonly configService: ConfigService,
    private readonly prms: ProfessionalsManagementService,
    private readonly ums: UserManagamentService,
    private readonly pms: PatientManagerService,
    private readonly ms: MailService,
    private readonly qcm: ProfessionalQuestionaryManager,
    private readonly pqms: PatientQuestionaryManagerService,
    private cus: CreateUserService,
  ) {}
  async onboardingForWeb(
    { professional, userInfo, additionalInfo }: SignUpPatientDto,
    isPatientDemo: boolean = false,
  ): Promise<SignUpPatientResponse> {
    const userEmail = await this.ums.getUserByEmail(userInfo.email);
    if (userEmail) throw new BadRequestException(ErrorUsersEnum.EMAIL_EXISTS, this.layer);

    const _proffesional = await this.prms.getProfessionalByUuid(professional, { 'uuid': 1, 'user.uuid': 1 });
    if (!_proffesional) throw new BadRequestException(ProfessionalMessages.PROFESSIONAL_NOT_FOUND, this.layer);

    const { uuid, firstname, lastname, email } = await this.cus.createUserForWebPatient(userInfo.email, {
      firstname: userInfo.firstname,
      lastname: userInfo.lastname,
      ...additionalInfo,
    });

    const patient = await this.pms.createPatient({
      professional,
      user: uuid,
      ...additionalInfo,
      origin: OriginPatientEnum.WEB,
      isActive: true,
    });

    const { questionaryGroups } = await this.qcm.getProfessionalQuestionary(professional);
    await this.pqms.createQuestionary({
      patient: patient.uuid,
      professional: _proffesional.uuid,
      questionaryGroups: questionaryGroups.map(({ _id, questionaryDetails, ...restGroup }) => ({
        ...restGroup,
        questionaryDetails: questionaryDetails.map(({ _id, ...rest }) => ({ ...rest })),
      })),
    });

    isPatientDemo;
    // if (!isPatientDemo) await this.sendMail(_proffesional.user.uuid, uuid, email, firstname);

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
  async onboardingForMobile({ email, password }: SignUpPatientFromMobileDto): Promise<UserValidated> {
    const user = await this.ums.getUserByEmail(email);
    if (user) throw new BadRequestException(ErrorUsersEnum.EMAIL_EXISTS, this.layer);

    const { uuid, role } = await this.cus.createUserForMobilePatient(email, {
      password: EncryptionService.encrypt(password),
    });

    await this.pms.createPatient({
      user: uuid,
      isActive: true,
      origin: OriginPatientEnum.MOBILE,
      state: PatientState.ACTIVE,
    });

    return { uuid, role };
  }
  private async sendMail(
    proffesionalUser: string,
    patientUserId: string,
    patientEmail: string,
    patientFirstname: string,
  ): Promise<void> {
    const { firstname: professionalFirstname, lastname: professionalLastname } = await this.ums.getUserByUuid(proffesionalUser);
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
