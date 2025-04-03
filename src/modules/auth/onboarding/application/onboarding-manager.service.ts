import { Injectable } from '@nestjs/common';
import { SignUpPatientManagamentService } from 'src/modules/auth/auth/application/services/sign-up-patient-management.service';

import { ProgramManagementService } from 'src/modules/professionals/programs/application/program-management.service';
import { EnumSources } from 'src/shared/enums/project';

enum SystemProgramNames {
  PROGRAM_TO_HEAL_CANCER = 'Program to heal cancer',
}

@Injectable()
export class OnboardingManagerService {
  constructor(private readonly supms: SignUpPatientManagamentService, private readonly pms: ProgramManagementService) {}

  async onboardProfessional(_professional: string, email: string): Promise<void> {
    await this.supms.signUpPatientFromWeb(
      {
        professional: _professional,
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
    await this.pms.createProgram({
      professional: _professional,
      name,
      description,
      plans: plans.map(({ _id, createdAt, updatedAt, ...rest }) => ({ ...rest })),
      source: EnumSources.PROFESSIONAL,
    });
  }
}
