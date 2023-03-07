import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { IValidateUserUseCase } from '../../../application/ports/in/validate-user.use-case';
import { AuthService } from '../../../application/services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private validateUserUseCase: IValidateUserUseCase;
  constructor(authService: AuthService) {
    super({
      usernameField: 'email',
    });
    this.validateUserUseCase = authService;
  }

  async validate(email: string, password: string): Promise<any> {
    password
    const user = await this.validateUserUseCase.validateUser(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user; //passing user to context
  }
}
