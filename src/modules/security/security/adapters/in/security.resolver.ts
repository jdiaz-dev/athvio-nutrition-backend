import { AuthenticationGuard } from './guards/authentication.guard';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { JwtDto } from './dtos/jwt.dto';
import { LoginDto } from './dtos/login.dto';
import { UseGuards } from '@nestjs/common';
import { AuthService } from 'src/modules/security/security/application/services/auth.service';
import { UserLoged } from 'src/modules/security/security/application/services/auth.types';

@Resolver()
export class SecurityResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => JwtDto)
  @UseGuards(AuthenticationGuard)
  async logIn(@Args('input') body: LoginDto, @Context() context: unknown): Promise<UserLoged> {
    context;
    const userLoged = await this.authService.login(body);
    return userLoged;
  }
}
