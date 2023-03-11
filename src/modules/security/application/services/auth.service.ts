import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IGetUserEmailForSecurityDomain, IGetUserForSecurityDomain } from '../ports/out/get-user-for-security-domain';

import * as bcryptjs from 'bcryptjs';
import { IValidateUserUseCase } from '../ports/in/validate-user.use-case';
import { LoginDto } from '../../adapters/in/dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersPersistenceService } from 'src/modules/users/users/adapters/out/users-persistence.service';

@Injectable()
export class AuthService implements IValidateUserUseCase {
  private getUserEmailForSecurity: IGetUserEmailForSecurityDomain;
  private getUserForSecurity: IGetUserForSecurityDomain;

  constructor(private readonly jwtService: JwtService, readonly usersPersistence: UsersPersistenceService) {
    this.getUserEmailForSecurity = usersPersistence;
    this.getUserForSecurity = usersPersistence;
  }
  async validateUser(email: string): Promise<any> {
    const user = await this.getUserEmailForSecurity.getUserByEmail(email);
    return user;
  }
  async login(loginDto: LoginDto) {
    const { userId, password, ...user } = (await this.getUserForSecurity.getUserByEmail(loginDto.email)).toJSON();
    user;
    const validPassword = bcryptjs.compare(loginDto.password, password);

    if (!validPassword) throw new UnauthorizedException();
    return {
      userId: userId,
      token: this.jwtService.sign({ userId , algo: "asdadsf"}),
    };
  }
}

