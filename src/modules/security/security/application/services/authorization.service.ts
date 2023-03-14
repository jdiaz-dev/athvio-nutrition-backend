import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserManagementService } from 'src/modules/security/users/application/user-management.service';

@Injectable()
export class AuthorizationService {
  constructor(private ums: UserManagementService) {}
  async verifyIfIsProfessional(userId: string): Promise<any> {
    const user = await this.ums.getUserById(userId);
    if (!user.isProfessional) throw new UnauthorizedException();
    return user;
  }
}
