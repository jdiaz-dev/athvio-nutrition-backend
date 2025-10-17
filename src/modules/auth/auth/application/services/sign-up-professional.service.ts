import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from 'src/modules/auth/auth/application/services/authentication.service';
import { SignUpProfessionalDto } from 'src/modules/auth/auth/adapters/in/web/dtos/sign-up-professional.dto';
import { ProfessionalOnboardingManagerService } from 'src/modules/auth/onboarding/application/professional-onboarding-manager.service';
import { GoogleVerifierService } from 'src/modules/auth/auth/application/services/google-verifier.service';
import { SignUpProfessionalWithGoogleDto } from 'src/modules/auth/auth/adapters/in/web/dtos/sign-up-professional-with-google.dto';
import { UserManagamentService } from 'src/modules/auth/users/application/user-management.service';
import { JwtDto } from 'src/modules/auth/auth/helpers/dtos/jwt.dto';
import { ProfessionalAuthErrors } from 'src/modules/auth/auth/helpers/auth-constants';
import { SignInProfessionalWithGoogleDto } from 'src/modules/auth/auth/adapters/in/web/dtos/sign-in-professional-with-google.dto';
import { SignUpProfessionalResponse } from 'src/modules/auth/auth/helpers/dtos/sign-up-profesional-response.dto';

@Injectable()
export class SignUpProfessionalService {
  constructor(
    private as: AuthenticationService,
    private poms: ProfessionalOnboardingManagerService,
    private ums: UserManagamentService,
    private gvs: GoogleVerifierService,
  ) {}

  async signUpProfessional(dto: SignUpProfessionalDto): Promise<SignUpProfessionalResponse> {
    const paymentLink = await this.poms.onboardProfessional(dto);
    return { paymentLink };
  }
  async signUpWithGoogle({
    clientOffsetMinutes,
    detectedLanguage,
    idToken,
  }: SignUpProfessionalWithGoogleDto): Promise<SignUpProfessionalResponse> {
    const payload = await this.gvs.verifyWithGoogle(idToken);

    const paymentLink = await this.poms.onboardProfessional({
      email: payload.email,
      googleSub: payload.sub,
      ...(payload.given_name && { firstname: payload.given_name }),
      ...(payload.family_name && { lastname: payload.family_name }),
      ...(payload.picture && { photo: payload.picture }),
      clientOffsetMinutes,
      detectedLanguage,
    });
    return { paymentLink };
  }
  async signInWithGoogle({ idToken }: SignInProfessionalWithGoogleDto): Promise<JwtDto> {
    const payload = await this.gvs.verifyWithGoogle(idToken);
    const user = (await this.ums.getUserByGoogleSub(payload.sub)) ?? (await this.ums.getUserByEmail(payload.email));
    if (!user) throw new UnauthorizedException(ProfessionalAuthErrors.PROFESSIONAL_UNAUTHORIZED);
    return this.as.generateToken({ uuid: user.uuid, role: user.role });
  }
}
