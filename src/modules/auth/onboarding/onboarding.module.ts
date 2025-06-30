import { Module } from '@nestjs/common';
import { PatientOnboardingManagerService } from 'src/modules/auth/onboarding/application/patient-onboarding-manager.service';
import { ProfessionalOnboardingManagerService } from 'src/modules/auth/onboarding/application/professional-onboarding-manager.service';
import { UsersModule } from 'src/modules/auth/users/users.module';
import { MailModule } from 'src/modules/mail/mail.module';
import { PatientsModule } from 'src/modules/patients/patients/patients.module';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { ProgramsModule } from 'src/modules/professionals/programs/programs.module';
import { ProfessionalQuestionariesModule } from 'src/modules/professionals/professional-questionaries/professional-questionaries.module';
import { PatientQuestionaryModule } from 'src/modules/patients/patient-questionaries/patient-questionary.module';

@Module({
  imports: [
    UsersModule,
    PatientsModule,
    ProfessionalsModule,
    ProgramsModule,
    ProfessionalQuestionariesModule,
    PatientQuestionaryModule,
    MailModule,
  ],
  providers: [PatientOnboardingManagerService, ProfessionalOnboardingManagerService],
  exports: [PatientOnboardingManagerService, ProfessionalOnboardingManagerService],
})
export class OnboardingModule {}
