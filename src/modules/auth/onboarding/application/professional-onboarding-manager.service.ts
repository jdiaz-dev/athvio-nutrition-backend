import { BadRequestException, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { SignUpProfessionalDto } from 'src/modules/auth/auth/adapters/in/web/dtos/sign-up-professional.dto';
import { EncryptionService } from 'src/modules/auth/auth/application/services/encryption.service';
import { PatientOnboardingManagerService } from 'src/modules/auth/onboarding/application/patient-onboarding-manager.service';
import { CreateUserService } from 'src/modules/auth/users/application/create-user.service';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';
import { AssignProgramService } from 'src/modules/professionals/programs/application/assign-program.service';

import { ProgramManagerService } from 'src/modules/professionals/programs/application/program-manager.service';
import { ErrorUsersEnum } from 'src/shared/enums/messages-response';
import { EnumSources, LayersServer, SupportedLanguages } from 'src/shared/enums/project';
import { UserManagamentService } from 'src/modules/auth/users/application/user-management.service';
import { ProfessionalQuestionaryManager } from 'src/modules/professionals/professional-questionaries/application/profesional-questionary-manager.service';
import { UserValidated } from 'src/modules/auth/auth/application/ports/in/validate-user.use-case';

enum SystemProgramNames {
  PROGRAM_TO_HEAL_CANCER = 'Program to heal cancer',
  PROGRAMA_PARA_CURAR_CANCER = 'Programa para curar cancer',
}

function getClientLocalTimeFromOffset(utcISOString: string, clientOffsetMinutes: number) {
  const utcDate = new Date(utcISOString);
  const localTime = new Date(utcDate.getTime() - clientOffsetMinutes * 60 * 1000);
  return dayjs(localTime);
}

@Injectable()
export class ProfessionalOnboardingManagerService {
  constructor(
    private readonly supms: PatientOnboardingManagerService,
    private readonly pms: ProgramManagerService,
    private prms: ProfessionalsManagementService,
    private readonly aps: AssignProgramService,
    private ums: UserManagamentService,
    private cus: CreateUserService,
    private qcm: ProfessionalQuestionaryManager,
  ) {}

  async onboardProfessional(dto: SignUpProfessionalDto): Promise<UserValidated> {
    const { uuid, professional, role } = await this.createProfessionalAndUser(dto);
    this.createDefaultData(professional, dto).catch((error) => console.log(error));
    return { uuid, role };
  }
  private async createProfessionalAndUser({
    professionalInfo,
    clientOffsetMinutes,
    detectedLanguage,
    firstname,
    lastname,
    email,
    password,
    ...userDto
  }: SignUpProfessionalDto): Promise<{ professional: string } & UserValidated> {
    const user = await this.ums.getUserByEmail(email);
    if (user) throw new BadRequestException(ErrorUsersEnum.EMAIL_EXISTS, LayersServer.APPLICATION);

    const { uuid, role } = await this.cus.createUserForProfessional(email, {
      ...userDto,
      firstname,
      lastname,
      password: EncryptionService.encrypt(password),
    });

    const { uuid: professionalId } = await this.prms.createProfessional({
      user: uuid,
      ...professionalInfo,
    });

    return { uuid, professional: professionalId.toString(), role };
  }
  private async createDefaultData(professional: string, dto: SignUpProfessionalDto) {
    await this.qcm.createQuestionary(professional);
    const programId = await this.createDefaultProgram(professional, dto.detectedLanguage);
    await this.createDefaultPatient(professional, dto, programId);
  }
  private async createDefaultProgram(professional: string, detectedLanguage: SupportedLanguages): Promise<string> {
    const { name, description, plans } = await this.pms.getProgram({
      name:
        detectedLanguage === SupportedLanguages.ENGLISH
          ? SystemProgramNames.PROGRAM_TO_HEAL_CANCER
          : SystemProgramNames.PROGRAMA_PARA_CURAR_CANCER,
      source: EnumSources.SYSTEM,
      language: detectedLanguage,
    });
    const { _id } = await this.pms.createProgram({
      professional,
      name,
      description,
      plans: plans.map(({ _id, createdAt, updatedAt, ...rest }) => ({ ...rest })),
      source: EnumSources.PROFESSIONAL,
    });
    return _id;
  }
  private async createDefaultPatient(professional: string, dto: SignUpProfessionalDto, programId: string): Promise<void> {
    const { _id: patient } = await this.supms.onboardingForWeb(
      {
        professional,
        userInfo: {
          firstname: dto.detectedLanguage === SupportedLanguages.ENGLISH ? 'Steve' : 'Juan',
          lastname: dto.detectedLanguage === SupportedLanguages.ENGLISH ? 'Johnson [Demo]' : 'Pérez [Demo]',
          email: `demo_${dto.email}`,
        },
      },
      true,
    );

    const iso = new Date().toISOString();
    const _date = getClientLocalTimeFromOffset(iso, dto.clientOffsetMinutes);
    await this.aps.assignProgramToPatient({
      professional,
      program: programId,
      assignmentStartDate: new Date(_date.year(), _date.month(), 7),
      patients: [patient],
      startingDay: 1,
    });
  }
}
