import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { SignUpPatientManagamentService } from 'src/modules/auth/auth/application/services/sign-up-patient-management.service';
import { AssignProgramService } from 'src/modules/professionals/programs/application/assign-program.service';

import { ProgramManagementService } from 'src/modules/professionals/programs/application/program-management.service';
import { EnumSources } from 'src/shared/enums/project';

enum SystemProgramNames {
  PROGRAM_TO_HEAL_CANCER = 'Program to heal cancer',
}

function getClientLocalTimeFromOffset(utcISOString: string, clientOffsetMinutes: number) {
  const utcDate = new Date(utcISOString);
  const localTime = new Date(utcDate.getTime() - clientOffsetMinutes * 60 * 1000);
  return dayjs(localTime);
}

function getFirstDayOfThirdWeek(year: number, month: number, weekStartsOn = 1) {
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const adjustedDay = firstDayWeekday === 0 && weekStartsOn === 1 ? 7 : firstDayWeekday;
  const offsetToWeekStart = (7 + adjustedDay - weekStartsOn) % 7;
  const dayOfThirdWeek = 1 + offsetToWeekStart + 7 * 2;
  return new Date(year, month, dayOfThirdWeek);
}

@Injectable()
export class OnboardingManagerService {
  constructor(
    private readonly supms: SignUpPatientManagamentService,
    private readonly pms: ProgramManagementService,
    private readonly aps: AssignProgramService,
  ) {}

  async onboardProfessional(professional: string, email: string, clientOffsetMinutes: number): Promise<void> {
    const { _id: patient } = await this.supms.signUpPatientFromWeb(
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

    const { name, description, plans } = await this.pms.getProgram({
      name: SystemProgramNames.PROGRAM_TO_HEAL_CANCER,
      source: EnumSources.SYSTEM,
    });
    const { _id } = await this.pms.createProgram({
      professional: professional,
      name,
      description,
      plans: plans.map(({ _id, createdAt, updatedAt, ...rest }) => ({ ...rest })),
      source: EnumSources.PROFESSIONAL,
    });
    const iso = new Date().toISOString();
    const _date = getClientLocalTimeFromOffset(iso, clientOffsetMinutes);
    await this.aps.assignProgramToPatient({
      professional,
      program: _id,
      assignmentStartDate: getFirstDayOfThirdWeek(_date.year(), _date.month()),
      patients: [patient],
      startingDay: 1,
    });
  }
}
