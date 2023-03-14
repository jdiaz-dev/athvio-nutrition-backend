import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserManagementService } from 'src/modules/security/users/application/user-management.service';
import { AuthorizationMessages } from 'src/shared/enums/messages-response';

@Injectable()
export class AuthorizationProfessionalGuard implements CanActivate {
  constructor(private ums: UserManagementService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const userContext = ctx.getContext().req.user;
    const user = await this.ums.getUserById(userContext.userId);

    if (!user.isProfessional) throw new UnauthorizedException(AuthorizationMessages.NOT_AUTHORIZED);
    return true;
  }
}
