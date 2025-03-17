import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignUpPatientFromMobileDto } from 'src/modules/authentication/authentication/adapters/in/mobile/dtos/sign-up-patient-from-mobile.dto';
import { JwtDto } from 'src/modules/authentication/authentication/helpers/dtos/jwt.dto';

import { SignUpPatientManagamentService } from 'src/modules/authentication/authentication/application/services/sign-up-patient-management.service';

@Resolver()
export class PatientAuthenticationResolver {
  constructor(private sppms: SignUpPatientManagamentService) {}

  @Mutation(() => JwtDto)
  signUpPatientFromMobile(@Args('input') dto: SignUpPatientFromMobileDto): Promise<JwtDto> {
    return this.sppms.signUpPatientFromMobile(dto);
  }
}
