import { Injectable, UnauthorizedException } from '@nestjs/common';

import * as bcryptjs from 'bcryptjs';
import { IValidateUserUseCase } from '../ports/in/validate-user.use-case';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/modules/security/security/adapters/in/dtos/login.dto';
import { UserType } from 'src/shared/enums/project';
import { UsersPersistenceService } from 'src/modules/security/users/adapters/out/users-persistence.service';

@Injectable()
export class AuthService implements IValidateUserUseCase {
  constructor(private readonly jwtService: JwtService, private ups: UsersPersistenceService) {}
  async validateUser(email: string): Promise<any> {
    const user = await this.ups.getUserByEmail(email);
    return user;
  }
  async login(loginDto: LoginDto) {
    const { _id, password, ...user } = await this.ups.getUserByEmail(loginDto.email);
    user;
    const validPassword = bcryptjs.compare(loginDto.password, password);

    if (!validPassword) throw new UnauthorizedException();
    return {
      _id: user.professional ? user.professional : user.client,
      userType: user.professional ? UserType.PROFESSIONAL : UserType.CLIENT,
      token: this.jwtService.sign({ user: _id.toString() }),
    };
  }
}
