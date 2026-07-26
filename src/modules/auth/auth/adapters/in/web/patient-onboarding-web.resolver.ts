import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { SignUpPatientManagerService } from 'src/modules/auth/auth/application/services/sign-up-patient-manager.service';
import { UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/adapters/in/guards/authorization-professional.guard';
import { SignUpPatientDto, SignUpPatientResponse } from 'src/modules/auth/auth/adapters/in/web/dtos/sign-up-patient.dto';

@Resolver()
export class PatientOnboardingWebResolver {
  constructor(private sppms: SignUpPatientManagerService) {}

  @UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
  @Mutation(() => SignUpPatientResponse)
  signUpPatient(@Args('input') dto: SignUpPatientDto): Promise<SignUpPatientResponse> {
    return this.sppms.signUpPatientFromWeb(dto);
  }
}
