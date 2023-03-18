import { Injectable, UnauthorizedException } from '@nestjs/common';

import * as bcryptjs from 'bcryptjs';
import { IValidateUserUseCase } from '../ports/in/validate-user.use-case';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/modules/security/security/adapters/in/dtos/login.dto';
import { UserManagementService } from 'src/modules/security/users/application/user-management.service';
import { UserType } from 'src/shared/enums/project';

@Injectable()
export class AuthService implements IValidateUserUseCase {
  constructor(private readonly jwtService: JwtService, private ums: UserManagementService) {}
  async validateUser(email: string): Promise<any> {
    const user = await this.ums.getUserByEmail(email);
    return user;
  }
  async login(loginDto: LoginDto) {
    const { _id, password, ...user } = await this.ums.getUserByEmail(loginDto.email);
    user;
    const validPassword = bcryptjs.compare(loginDto.password, password);

    if (!validPassword) throw new UnauthorizedException();
    return {
      _id: user.professionalId ? user.professionalId : user.clientId,
      userType: user.professionalId ? UserType.PROFESSIONAL : UserType.CLIENT,
      token: this.jwtService.sign({ userId: _id.toString() }),
    };
  }
}
