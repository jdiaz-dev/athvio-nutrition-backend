import { Injectable } from '@nestjs/common';
import { AuthenticationService } from 'src/modules/auth/auth/application/services/authentication.service';
import { UserLoged } from 'src/modules/auth/auth/helpers/auth.types';
import { SignUpProfessionalDto } from 'src/modules/auth/auth/adapters/in/web/dtos/sign-up-professional.dto';
import { ProfessionalOnboardingManagerService } from 'src/modules/auth/onboarding/application/professional-onboarding-manager.service';
import { GoogleAuthenticationService } from 'src/modules/auth/auth/application/services/google-authentication.service';
import { SignUpProfessionalWithGoogleDto } from 'src/modules/auth/auth/adapters/in/web/dtos/sign-up-professional-with-google.dto';
import { UserManagamentService } from 'src/modules/auth/users/application/user-management.service';

@Injectable()
export class SignUpProfessionalService {
  constructor(
    private as: AuthenticationService,
    private poms: ProfessionalOnboardingManagerService,
    private ums: UserManagamentService,
    private gas: GoogleAuthenticationService,
  ) {}

  async signUpProfessional(dto: SignUpProfessionalDto): Promise<UserLoged> {
    const { uuid, role } = await this.poms.onboardProfessional(dto);
    return this.as.generateToken({ uuid, role });
  }
  async signUpWithGoogle({
    clientOffsetMinutes,
    detectedLanguage,
    idToken,
  }: SignUpProfessionalWithGoogleDto): Promise<UserLoged> {
    const payload = await this.gas.loginWithGoogle(idToken);
    const { uuid, role } =
      (await this.ums.getUserByGoogleSub(payload.sub)) ??
      (await this.ums.getUserByEmail(payload.email)) ??
      (await this.poms.onboardProfessional({
        email: payload.email,
        googleSub: payload.sub,
        ...(payload.given_name && { firstname: payload.given_name }),
        ...(payload.family_name && { lastname: payload.family_name }),
        ...(payload.picture && { photo: payload.picture }),
        clientOffsetMinutes,
        detectedLanguage,
      }));
    return this.as.generateToken({ uuid, role });
  }
}
