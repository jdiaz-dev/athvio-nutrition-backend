import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersPersistenceService } from 'src/modules/authentication/users/adapters/out/users-persistence.service';
import { AuthorizationMessages } from 'src/shared/enums/messages-response';

@Injectable()
export class AuthorizationService {
  constructor(private ups: UsersPersistenceService) {}
  async verifyIfIsProfessional(user: string): Promise<boolean> {
    const _user = await this.ups.getUserById(user);
    if (!_user.isProfessional) throw new UnauthorizedException(AuthorizationMessages.NOT_AUTHORIZED);
    return true;
  }
}
