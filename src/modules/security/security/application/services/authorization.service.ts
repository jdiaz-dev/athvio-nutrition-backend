import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersPersistenceService } from 'src/modules/security/users/adapters/out/users-persistence.service';


@Injectable()
export class AuthorizationService {
  constructor(private ups: UsersPersistenceService) {}
  async verifyIfIsProfessional(user: string): Promise<any> {
    const _user = await this.ups.getUserById(user);
    if (!_user.isProfessional) throw new UnauthorizedException();
    return _user;
  }
}
