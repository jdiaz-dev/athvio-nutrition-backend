import { AuthenticationGuard } from './guards/authentication.guard';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { JwtDto } from './dtos/jwt.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from './../../application/services/auth.service';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class SecurityResolver {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthenticationGuard)
  @Mutation(() => JwtDto)
  async logIn(@Args('input') body: LoginDto, @Context() context: any) {
    context;
    return await this.authService.login(body);
  }
}
