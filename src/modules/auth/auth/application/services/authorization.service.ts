import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserManagamentService } from 'src/modules/auth/users/application/user-management.service';
import { AuthorizationMessages } from 'src/shared/enums/messages-response';
import { EnumRoles } from 'src/shared/enums/project';

@Injectable()
export class AuthorizationService {
  constructor(private ums: UserManagamentService) {}
  async verifyIfIsProfessional(user: string): Promise<boolean> {
    const _user = await this.ums.getUserById(user);
    if (_user.role !== EnumRoles.PROFESSIONAL) throw new UnauthorizedException(AuthorizationMessages.NOT_AUTHORIZED);
    return true;
  }
  async verifyIfIsPatient(user: string): Promise<boolean> {
    const _user = await this.ums.getUserById(user);
    if (_user.role !== EnumRoles.PATIENT) throw new UnauthorizedException(AuthorizationMessages.NOT_AUTHORIZED);
    return true;
  }
}
