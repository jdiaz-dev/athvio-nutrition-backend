import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import * as bcryptjs from 'bcryptjs';
import { IValidateUserUseCase, UserValidated } from '../ports/in/validate-user.use-case';
import { JwtService } from '@nestjs/jwt';
import { ErrorAuthEnum, ErrorPatientsEnum, ProfessionalMessages } from 'src/shared/enums/messages-response';
import { GetPatientManagerService } from 'src/modules/patients/patients/application/get-patient-manager.service';
import { EnumRoles } from 'src/modules/auth/shared/enums';
import { UserManagamentService } from 'src/modules/auth/users/application/user-management.service';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';
import { JwtDto } from 'src/modules/auth/auth/helpers/dtos/jwt.dto';

@Injectable()
export class AuthenticationService implements IValidateUserUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private ums: UserManagamentService,
    private pms: ProfessionalsManagementService,
    private gps: GetPatientManagerService,
  ) {}
  async validateCredentials(email: string, _password: string): Promise<UserValidated> {
    const user = await this.ums.getUserByEmail(email);
    if (!user) throw new NotFoundException(ErrorAuthEnum.EMAIL_NOT_FOUND);
    if (user && user.googleSub && _password) throw new UnauthorizedException(ErrorAuthEnum.INVALID_ACCESS_METHOD);

    const { uuid, role, password } = user;
    const validPassword = await bcryptjs.compare(_password, password);

    if (!validPassword) throw new UnauthorizedException(ErrorAuthEnum.BAD_CREDENTIALS);

    if (role === EnumRoles.PROFESSIONAL) {
      const professional = await this.pms.getProfessionalByUser(uuid);
      if (!professional) throw new BadRequestException(ProfessionalMessages.PROFESSIONAL_NOT_FOUND);
    } else if (role === EnumRoles.PATIENT) {
      const patient = await this.gps.getPatientByUser(uuid);
      if (!patient) throw new BadRequestException(ErrorPatientsEnum.PATIENT_NOT_FOUND);
    }

    return { uuid, role };
  }
  async generateToken(userValidated: UserValidated): Promise<JwtDto> {
    const res: JwtDto = {
      uuid: await this.getUuidOfRole(userValidated),
      role: userValidated.role,
      token: this.jwtService.sign({ user: (await this.ums.getUserByUuid(userValidated.uuid)).uuid }, { expiresIn: '1d' }),
    };
    return res;
  }
  private async getUuidOfRole({ uuid, role }: UserValidated) {
    if (role === EnumRoles.PROFESSIONAL) {
      return (await this.pms.getProfessionalByUser(uuid)).uuid;
    } else {
      return (await this.gps.getPatientByUser(uuid)).uuid;
    }
  }
}
