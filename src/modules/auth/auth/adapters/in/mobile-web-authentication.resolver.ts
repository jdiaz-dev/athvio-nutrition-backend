import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthenticationService } from 'src/modules/auth/auth/application/services/authentication.service';
import { JwtDto } from 'src/modules/auth/auth/helpers/dtos/jwt.dto';
import { SignInDto } from 'src/modules/auth/auth/adapters/in/web/dtos/sign-in.dto';
import { AuthenticationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authentication.guard';
import { SignUpProfessionalService } from 'src/modules/auth/auth/application/services/sign-up-professional.service';
import { SignInProfessionalWithGoogleDto } from 'src/modules/auth/auth/adapters/in/web/dtos/sign-in-professional-with-google.dto';

@Resolver()
export class MobileWebAuthenticationResolver {
  constructor(
    private authService: AuthenticationService,
    private sups: SignUpProfessionalService,
  ) {}

  @Mutation(() => JwtDto)
  @UseGuards(AuthenticationGuard)
  async signIn(@Args('input') _body: SignInDto, @Context() context: any): Promise<JwtDto> {
    const userLoged = await this.authService.generateToken(context.user);
    return userLoged;
  }

  @Mutation(() => JwtDto)
  async signInWithGoogle(@Args('input') dto: SignInProfessionalWithGoogleDto): Promise<JwtDto> {
    return this.sups.signUpOrSignInWithGoogle(dto);
  }
}
