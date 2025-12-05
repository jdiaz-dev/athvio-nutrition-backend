import { BadRequestException, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { SignUpProfessionalDto } from 'src/modules/auth/auth/adapters/in/web/dtos/sign-up-professional.dto';
import { EncryptionService } from 'src/modules/auth/auth/application/services/encryption.service';
import { PatientOnboardingManagerService } from 'src/modules/onboarding/application/patient-onboarding-manager.service';
import { CreateUserService } from 'src/modules/auth/users/application/create-user.service';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';
import { AssignProgramService } from 'src/modules/professionals/programs/application/assign-program.service';

import { ProgramManagerService } from 'src/modules/professionals/programs/application/program-manager.service';
import { ErrorUsersEnum } from 'src/shared/enums/messages-response';
import { EnumSources, LayersServer, SupportedLanguages } from 'src/shared/enums/project';
import { UserManagamentService } from 'src/modules/auth/users/application/user-management.service';
import { ProfessionalQuestionaryManager } from 'src/modules/professionals/professional-questionaries/application/profesional-questionary-manager.service';
import { UserValidated } from 'src/modules/auth/auth/application/ports/in/validate-user.use-case';
import { CreatePaymentLinkService } from 'src/modules/professionals/payments/application/create-payment-link.service';
import { PlanificationManagerService } from 'src/modules/patients/planifications/application/planification-manager.service';
import { NotesManagerService } from 'src/modules/patients/notes/application/notes-manager.service';

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
    private readonly prms: ProfessionalsManagementService,
    private readonly aps: AssignProgramService,
    private readonly ums: UserManagamentService,
    private readonly cus: CreateUserService,
    private readonly qcm: ProfessionalQuestionaryManager,
    private readonly cpls: CreatePaymentLinkService,
    private readonly plms: PlanificationManagerService,
    private readonly nms: NotesManagerService,
  ) {}

  async onboardProfessional(dto: SignUpProfessionalDto & { googleSub?: string; photo?: string }): Promise<string> {
    const { professional } = await this.createProfessionalAndUser(dto);
    this.createDefaultData(professional, dto).catch((error) => console.error(error));
    const paymentLink = await this.cpls.createPaymentLink(professional);
    return paymentLink;
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
      ...(password && { password: EncryptionService.encrypt(password) }),
    });

    const { uuid: professionalUuid } = await this.prms.createProfessional({
      user: uuid,
      ...professionalInfo,
    });
    return { uuid, professional: professionalUuid, role };
  }
  private async createDefaultData(professional: string, dto: SignUpProfessionalDto) {
    await this.qcm.createQuestionary(professional);
    const programId = await this.createDefaultProgram(professional, dto.detectedLanguage);
    await this.onboardDemoPatient(professional, dto, programId);
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
    const { uuid } = await this.pms.createProgramForOnboarding({
      professional,
      name,
      description,
      plans: plans.map(({ _id, createdAt, updatedAt, ...rest }) => ({ ...rest })),
      source: EnumSources.PROFESSIONAL,
    });
    return uuid;
  }
  private async onboardDemoPatient(professional: string, dto: SignUpProfessionalDto, programId: string): Promise<void> {
    const { uuid: patient } = await this.supms.onboardingForWeb(
      {
        professional,
        userInfo: {
          firstname: dto.detectedLanguage === SupportedLanguages.ENGLISH ? 'Kathelyn' : 'Káterin',
          lastname: dto.detectedLanguage === SupportedLanguages.ENGLISH ? 'Johnson [Demo]' : 'Pérez [Paciente de prueba]',
          email: `demo_${dto.email}`,
        },
      },
      true,
    );

    const iso = new Date().toISOString();
    const _date = getClientLocalTimeFromOffset(iso, dto.clientOffsetMinutes);
    await this.plms.createPlanification({
      patient,
      patientInformation: {
        weight: 58,
        height: 163,
        age: 20,
        gender: 'female',
        physicActivityName: 'Sedentario',
        physicActivityFactor: 1.2,
      },
      configuredMacros: {
        proteinInPercentage: 0,
        carbsInPercentage: 0,
        fatInPercentage: 0,
        proteinDensity: 0,
        carbsDensity: 0,
        fatDensity: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        basalEnergyRate: 0,
        totalCalories: 0,
        planCalories: 3000,
      },
    });
    await this.aps.assignProgramToPatient({
      professional,
      program: programId,
      assignmentStartDate: new Date(_date.year(), _date.month(), 7),
      patients: [patient],
      startingDay: 1,
    });
    await this.nms.createNote({
      patient,
      date: new Date().toISOString(),
      professional,
      content: `
      - Sufre con 7 años de depresión.
      - Gastritis crónica por 3 meses.
      - Sufre de fibromialgia, con dolores en la lumbar derecha y rodilla izquierda. Tiene estos dolores 6 meses
      - Paciente parasitado.
      `,
    });
  }
}
