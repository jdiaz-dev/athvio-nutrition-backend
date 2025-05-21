import { Injectable } from '@nestjs/common';
import { AuthenticationService } from 'src/modules/auth/auth/application/services/authentication.service';
import { UserLoged } from 'src/modules/auth/auth/helpers/auth.types';
import { SignUpProfessionalDto } from 'src/modules/auth/auth/adapters/in/web/dtos/sign-up-professional.dto';
import { ProfessionalOnboardingManagerService } from 'src/modules/auth/onboarding/application/professional-onboarding-manager.service';

@Injectable()
export class SignUpProfessionalService {
  constructor(private as: AuthenticationService, private poms: ProfessionalOnboardingManagerService) {}

  async signUpProfessional(dto: SignUpProfessionalDto): Promise<UserLoged> {
    const { user: _id, role } = await this.poms.onboardProfessional(dto);
    return this.as.generateToken({ _id, role });
  }
}
