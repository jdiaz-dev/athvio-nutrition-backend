import { Injectable, UnauthorizedException } from '@nestjs/common';

import * as bcryptjs from 'bcryptjs';
import { IValidateUserUseCase } from '../ports/in/validate-user.use-case';
import { JwtService } from '@nestjs/jwt';
import { UserType } from 'src/shared/enums/project';
import { UsersPersistenceService } from 'src/modules/authentication/users/adapters/out/users-persistence.service';
import { UserLoged } from 'src/modules/authentication/authentication/application/services/auth.types';
import { User } from 'src/modules/authentication/users/adapters/out/user.schema';
import { SignInDto } from 'src/modules/authentication/authentication/adapters/in/dtos/sign-in.dto';

@Injectable()
export class AuthService implements IValidateUserUseCase {
  constructor(private readonly jwtService: JwtService, private ups: UsersPersistenceService) {}
  async validateUser(email: string): Promise<User> {
    const user = await this.ups.getUserByEmail(email);
    return user;
  }
  async signIn(dto: SignInDto): Promise<UserLoged> {
    const { _id, password, ...user } = await this.ups.getUserByEmail(dto.email);
    user;
    const validPassword = await bcryptjs.compare(dto.password, password);
    if (!validPassword) throw new UnauthorizedException();

    const res: UserLoged = {
      _id: user.professional ? user.professional : user.client,
      userType: user.professional ? UserType.PROFESSIONAL : UserType.CLIENT,
      token: this.jwtService.sign({ user: _id.toString() }),
    };
    return res;
  }
}
