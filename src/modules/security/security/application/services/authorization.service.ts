import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersPersistenceService } from 'src/modules/security/users/adapters/out/users-persistence.service';


@Injectable()
export class AuthorizationService {
  constructor(private ups: UsersPersistenceService) {}
  async verifyIfIsProfessional(userId: string): Promise<any> {
    const user = await this.ups.getUserById(userId);
    if (!user.isProfessional) throw new UnauthorizedException();
    return user;
  }
}
