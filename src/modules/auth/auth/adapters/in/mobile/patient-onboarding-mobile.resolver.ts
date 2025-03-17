import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignUpPatientFromMobileDto } from 'src/modules/auth/auth/adapters/in/mobile/dtos/sign-up-patient-from-mobile.dto';
import { JwtDto } from 'src/modules/auth/auth/helpers/dtos/jwt.dto';

import { SignUpPatientManagamentService } from 'src/modules/auth/auth/application/services/sign-up-patient-management.service';

@Resolver()
export class PatientOnboardingMobileResolver {
  constructor(private sppms: SignUpPatientManagamentService) {}

  @Mutation(() => JwtDto)
  signUpPatientFromMobile(@Args('input') dto: SignUpPatientFromMobileDto): Promise<JwtDto> {
    return this.sppms.signUpPatientFromMobile(dto);
  }
}
