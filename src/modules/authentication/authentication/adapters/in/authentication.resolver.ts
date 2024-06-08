import { AuthenticationGuard } from './guards/authentication.guard';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { JwtDto } from './dtos/jwt.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { UseGuards } from '@nestjs/common';
import { AuthenticationService } from 'src/modules/authentication/authentication/application/services/authentication.service';
import { UserLoged } from 'src/modules/authentication/authentication/application/services/auth.types';
import { SignUpProfessionalDto } from 'src/modules/authentication/authentication/adapters/in/dtos/sign-up-professional.dto';
import {
  SignUpPatientDto,
  SignUpPatientResponse,
} from 'src/modules/authentication/authentication/adapters/in/dtos/sign-up-patient.dto';
import { SignUpService } from 'src/modules/authentication/authentication/application/services/sign-up.service';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { User } from 'src/modules/authentication/users/adapters/out/user.schema';
import { ActivatePatientDto } from 'src/modules/authentication/authentication/adapters/in/dtos/activate-user.dto';

@Resolver()
export class AuthenticationResolver {
  constructor(private authService: AuthenticationService, private sps: SignUpService) {}

  //TODO: think in one guard for this endpoint
  @Mutation(() => JwtDto)
  signUpProfessional(@Args('input') dto: SignUpProfessionalDto, @Context() context: unknown): Promise<JwtDto> {
    context;
    return this.sps.signUpProfessional(dto);
  }
  @UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
  @Mutation(() => SignUpPatientResponse)
  signUpPatient(@Args('input') dto: SignUpPatientDto): Promise<SignUpPatientResponse> {
    return this.sps.signUpPatient(dto);
  }

  @Mutation(() => JwtDto)
  @UseGuards(AuthenticationGuard)
  async signIn(@Args('input') body: SignInDto, @Context() context: any): Promise<UserLoged> {
    body;
    const userLoged = await this.authService.generateToken(context.user);
    return userLoged;
  }
  @Mutation(() => User)
  async activatePatient(@Args('input') body: ActivatePatientDto) {
    const activatedPatient = await this.sps.activatePatient(body);
    return activatedPatient;
  }
}
