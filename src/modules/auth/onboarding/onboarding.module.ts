import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth/auth.module';
import { OnboardingManagerService } from 'src/modules/auth/onboarding/application/onboarding-manager.service';
import { ProgramsModule } from 'src/modules/professionals/programs/programs.module';

@Module({
  imports: [forwardRef(() => AuthModule), ProgramsModule],
  providers: [OnboardingManagerService],
  exports: [OnboardingManagerService],
})
export class OnboardingModule {}
