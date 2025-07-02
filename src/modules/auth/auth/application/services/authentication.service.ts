import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import * as bcryptjs from 'bcryptjs';
import { IValidateUserUseCase, UserValidated } from '../ports/in/validate-user.use-case';
import { JwtService } from '@nestjs/jwt';
import { UsersPersistenceService } from 'src/modules/auth/users/adapters/out/users-persistence.service';
import { UserLoged } from 'src/modules/auth/auth/helpers/auth.types';
import { ErrorPatientsEnum, ErrorUsersEnum, ProfessionalMessages } from 'src/shared/enums/messages-response';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';
import { GetPatientManagerService } from 'src/modules/patients/patients/application/get-patient-manager.service';
import { EnumRoles } from 'src/modules/auth/shared/enums';

@Injectable()
export class AuthenticationService implements IValidateUserUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private ups: UsersPersistenceService,
    private pps: ProfessionalsPersistenceService,
    private gps: GetPatientManagerService,
  ) {}
  async validateCredentials(email: string, _password: string): Promise<UserValidated> {
    const user = await this.ups.getUserByEmail(email);
    if (!user) throw new NotFoundException(ErrorUsersEnum.USER_NOT_FOUND);

    const { _id, role, password } = user;
    const validPassword = await bcryptjs.compare(_password, password);

    if (!validPassword) throw new UnauthorizedException(ErrorUsersEnum.BAD_CREDENTIALS);

    if (role === EnumRoles.PROFESSIONAL) {
      const professional = await this.pps.getProfessionalByUser(_id);
      if (!professional) throw new BadRequestException(ProfessionalMessages.PROFESSIONAL_NOT_FOUND);
    } else if (role === EnumRoles.PATIENT) {
      const patient = await this.gps.getPatientByUser(_id);
      if (!patient) throw new BadRequestException(ErrorPatientsEnum.PATIENT_NOT_FOUND);
    }

    return { _id, role };
  }
  async generateToken(userValidated: UserValidated): Promise<UserLoged> {
    const res: UserLoged = {
      _id: await this.getRoleId(userValidated),
      role: userValidated.role,
      token: this.jwtService.sign({ user: userValidated._id.toString() }),
    };
    return res;
  }
  private async getRoleId({ _id: user, role }: UserValidated) {
    if (role === EnumRoles.PROFESSIONAL) {
      return (await this.pps.getProfessionalByUser(user))._id.toString();
    } else {
      return (await this.gps.getPatientByUser(user))._id.toString();
    }
  }
}
