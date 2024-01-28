import { AuthenticationGuard } from './guards/authentication.guard';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { JwtDto } from './dtos/jwt.dto';
import { SignInDto } from './dtos/login.dto';
import { UseGuards } from '@nestjs/common';
import { AuthService } from 'src/modules/authentication/authentication/application/services/auth.service';
import { UserLoged } from 'src/modules/authentication/authentication/application/services/auth.types';
import { User } from 'src/modules/authentication/users/adapters/out/user.schema';
import { SignUpProfessionalDto } from 'src/modules/authentication/authentication/adapters/in/dtos/sign-up-professional.dto';
import { SignUpClientDto, SignUpClientResponse } from 'src/modules/authentication/authentication/adapters/in/dtos/sign-up-client.dto';
import { SignUpService } from 'src/modules/authentication/authentication/application/services/sign-up.service';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';

@Resolver()
export class SecurityResolver {
  constructor(private authService: AuthService, private sps: SignUpService) {}

  @Mutation(() => User)
  signUpProfessional(@Args('input') dto: SignUpProfessionalDto, @Context() context: unknown): Promise<User> {
    context;
    return this.sps.signUpProfessional(dto);
  }
  @UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
  @Mutation(() => SignUpClientResponse)
  signUpClient(@Args('input') dto: SignUpClientDto): Promise<SignUpClientResponse> {
    return this.sps.signUpClient(dto);
  }

  @Mutation(() => JwtDto)
  @UseGuards(AuthenticationGuard)
  async signIn(@Args('input') body: SignInDto, @Context() context: unknown): Promise<UserLoged> {
    context;
    const userLoged = await this.authService.signIn(body);
    return userLoged;
  }
}
