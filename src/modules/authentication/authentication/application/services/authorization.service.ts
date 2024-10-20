import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersPersistenceService } from 'src/modules/authentication/users/adapters/out/users-persistence.service';
import { AuthorizationMessages } from 'src/shared/enums/messages-response';
import { EnumRoles } from 'src/shared/enums/project';

@Injectable()
export class AuthorizationService {
  constructor(private ups: UsersPersistenceService) {}
  async verifyIfIsProfessional(user: string): Promise<boolean> {
    const _user = await this.ups.getUserById(user);
    if (_user.role !== EnumRoles.PROFESSIONAL) throw new UnauthorizedException(AuthorizationMessages.NOT_AUTHORIZED);
    return true;
  }
  async verifyIfIsPatient(user: string): Promise<boolean> {
    const _user = await this.ups.getUserById(user);
    if (_user.role !== EnumRoles.PATIENT) throw new UnauthorizedException(AuthorizationMessages.NOT_AUTHORIZED);
    return true;
  }
}
