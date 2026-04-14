import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignUpPatientFromMobileDto } from 'src/modules/auth/auth/adapters/in/mobile/dtos/sign-up-patient-from-mobile.dto';
import { JwtDto } from 'src/modules/auth/auth/helpers/dtos/jwt.dto';

import { SignUpPatientManagerService } from 'src/modules/auth/auth/application/services/sign-up-patient-manager.service';
import { User } from 'src/modules/auth/users/adapters/out/user.schema';
import { ActivatePatientDto } from 'src/modules/auth/auth/adapters/in/mobile/dtos/activate-user.dto';

@Resolver()
export class PatientOnboardingMobileResolver {
  constructor(private sppms: SignUpPatientManagerService) {}

  @Mutation(() => JwtDto)
  signUpPatientFromMobile(@Args('input') dto: SignUpPatientFromMobileDto): Promise<JwtDto> {
    return this.sppms.signUpPatientFromMobile(dto);
  }
  @Mutation(() => User)
  async activatePatient(@Args('input') body: ActivatePatientDto) {
    const activatedPatient = await this.sppms.activatePatient(body);
    return activatedPatient;
  }
}
