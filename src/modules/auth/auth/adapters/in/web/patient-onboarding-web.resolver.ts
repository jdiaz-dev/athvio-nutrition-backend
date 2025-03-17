import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { SignUpPatientManagamentService } from 'src/modules/auth/auth/application/services/sign-up-patient-management.service';
import { UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import {
  SignUpPatientDto,
  SignUpPatientResponse,
} from 'src/modules/auth/auth/adapters/in/web/dtos/sign-up-patient.dto';
import { User } from 'src/modules/auth/users/adapters/out/user.schema';
import { ActivatePatientDto } from 'src/modules/auth/auth/adapters/in/web/dtos/activate-user.dto';

@Resolver()
export class PatientOnboardingWebResolver {
  constructor(private sppms: SignUpPatientManagamentService) {}

  @UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
  @Mutation(() => SignUpPatientResponse)
  signUpPatient(@Args('input') dto: SignUpPatientDto): Promise<SignUpPatientResponse> {
    return this.sppms.signUpPatient(dto);
  }
  @Mutation(() => User)
  async activatePatient(@Args('input') body: ActivatePatientDto) {
    const activatedPatient = await this.sppms.activatePatient(body);
    return activatedPatient;
  }
}
