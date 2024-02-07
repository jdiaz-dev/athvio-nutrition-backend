import { Injectable, UnauthorizedException } from '@nestjs/common';

import * as bcryptjs from 'bcryptjs';
import { IValidateUserUseCase, UserValidated } from '../ports/in/validate-user.use-case';
import { JwtService } from '@nestjs/jwt';
import { UserType } from 'src/shared/enums/project';
import { UsersPersistenceService } from 'src/modules/authentication/users/adapters/out/users-persistence.service';
import { UserLoged } from 'src/modules/authentication/authentication/application/services/auth.types';
import { ErrorUsersEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class AuthenticationService implements IValidateUserUseCase {
  constructor(private readonly jwtService: JwtService, private ups: UsersPersistenceService) {}
  async validateCredentials(email: string, _password: string): Promise<UserValidated> {
    const { _id, isProfessional, professional, patient, password } = await this.ups.getUserByEmail(email);
    const validPassword = await bcryptjs.compare(_password, password);

    if (!validPassword) throw new UnauthorizedException(ErrorUsersEnum.BAD_CREDENTIALS);

    return { _id, isProfessional, professional, patient };
  }
  async createToken(userValidated: UserValidated): Promise<UserLoged> {
    const res: UserLoged = {
      _id: userValidated.isProfessional ? userValidated.professional : userValidated.patient,
      userType: userValidated.isProfessional ? UserType.PROFESSIONAL : UserType.PATIENT,
      token: this.jwtService.sign({ user: userValidated._id.toString() }),
    };

    return res;
  }
}
