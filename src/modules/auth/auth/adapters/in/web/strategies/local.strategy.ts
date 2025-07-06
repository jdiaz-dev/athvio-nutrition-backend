import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { IValidateUserUseCase, UserValidated } from 'src/modules/auth/auth/application/ports/in/validate-user.use-case';
import { AuthenticationService } from 'src/modules/auth/auth/application/services/authentication.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private validateUserUseCase: IValidateUserUseCase;

  constructor(authService: AuthenticationService) {
    super({
      usernameField: 'email',
    });
    this.validateUserUseCase = authService;
  }
  async validate(email: string, password: string): Promise<UserValidated> {
    const isValidated = await this.validateUserUseCase.validateCredentials(email, password);
    return isValidated; //passing isValidated to context
  }
}
