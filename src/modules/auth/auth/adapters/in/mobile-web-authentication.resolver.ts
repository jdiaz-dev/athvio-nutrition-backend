import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthenticationService } from 'src/modules/auth/auth/application/services/authentication.service';
import { UserLoged } from 'src/modules/auth/auth/helpers/auth.types';
import { JwtDto } from 'src/modules/auth/auth/helpers/dtos/jwt.dto';
import { SignInDto } from 'src/modules/auth/auth/adapters/in/web/dtos/sign-in.dto';
import { AuthenticationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authentication.guard';

@Resolver()
export class MobileWebAuthenticationResolver {
  constructor(private authService: AuthenticationService) {}

  @Mutation(() => JwtDto)
  @UseGuards(AuthenticationGuard)
  async signIn(@Args('input') _body: SignInDto, @Context() context: any): Promise<UserLoged> {
    const userLoged = await this.authService.generateToken(context.user);
    return userLoged;
  }
}
