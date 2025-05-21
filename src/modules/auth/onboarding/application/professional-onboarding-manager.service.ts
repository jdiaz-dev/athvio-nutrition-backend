import { BadRequestException, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { SignUpProfessionalDto } from 'src/modules/auth/auth/adapters/in/web/dtos/sign-up-professional.dto';
import { EncryptionService } from 'src/modules/auth/auth/application/services/encryption.service';
import { PatientOnboardingManagerService } from 'src/modules/auth/onboarding/application/patient-onboarding-manager.service';
import { UsersPersistenceService } from 'src/modules/auth/users/adapters/out/users-persistence.service';
import { CreateUser } from 'src/modules/auth/users/adapters/out/users-types';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';
import { AssignProgramService } from 'src/modules/professionals/programs/application/assign-program.service';

import { ProgramManagementService } from 'src/modules/professionals/programs/application/program-management.service';
import { ErrorUsersEnum } from 'src/shared/enums/messages-response';
import { EnumRoles, EnumSources, LayersServer, SupportedLanguages } from 'src/shared/enums/project';

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
    private readonly pms: ProgramManagementService,
    private prms: ProfessionalsManagementService,
    private readonly aps: AssignProgramService,
    private ups: UsersPersistenceService,
  ) {}

  async onboardProfessional(dto: SignUpProfessionalDto): Promise<{ user: string; role: EnumRoles }> {
    const { user, professional, role } = await this.createProfessionalAndUser(dto);
    this.createDefaultData(professional, dto).catch((error) => error);
    return { user, role };
  }
  async createDefaultData(professional: string, dto: SignUpProfessionalDto) {
    const defultProgramId = await this.createDefaultProgram(professional, dto.detectedLanguage);
    await this.createDefaultPatient(professional, dto.email, dto.clientOffsetMinutes, defultProgramId);
  }
  private async createProfessionalAndUser({
    professionalInfo,
    clientOffsetMinutes,
    detectedLanguage,
    ...userDto
  }: SignUpProfessionalDto): Promise<{ user: string; professional: string; role: EnumRoles }> {
    const user = await this.ups.getUserByEmail(userDto.email);
    if (user) throw new BadRequestException(ErrorUsersEnum.EMAIL_EXISTS, LayersServer.APPLICATION);

    const _user: CreateUser = {
      ...userDto,
      password: EncryptionService.encrypt(userDto.password),
      role: EnumRoles.PROFESSIONAL,
      isActive: true,
    };
    const { _id, role } = await this.ups.createUser(_user);

    const { _id: professional } = await this.prms.createProfessional({
      user: _id,
      ...professionalInfo,
    });
    return { user: _id, professional, role };
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
      professional: professional,
      name,
      description,
      plans: plans.map(({ _id, createdAt, updatedAt, ...rest }) => ({ ...rest })),
      source: EnumSources.PROFESSIONAL,
    });
    return _id;
  }
  private async createDefaultPatient(
    professional: string,
    email: string,
    clientOffsetMinutes: number,
    defultProgramId: string,
  ): Promise<void> {
    const { _id: patient } = await this.supms.onboardingForWeb(
      {
        professional,
        userInfo: {
          firstname: 'patient',
          lastname: 'demo',
          email: `demo_${email}`,
        },
      },
      true,
    );

    const iso = new Date().toISOString();
    const _date = getClientLocalTimeFromOffset(iso, clientOffsetMinutes);
    await this.aps.assignProgramToPatient({
      professional,
      program: defultProgramId,
      assignmentStartDate: new Date(_date.year(), _date.month(), 7),
      patients: [patient],
      startingDay: 1,
    });
  }
}
