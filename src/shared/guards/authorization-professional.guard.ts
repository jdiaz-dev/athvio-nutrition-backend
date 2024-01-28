import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UsersPersistenceService } from 'src/modules/authentication/users/adapters/out/users-persistence.service';
import { AuthorizationMessages } from 'src/shared/enums/messages-response';

@Injectable()
export class AuthorizationProfessionalGuard implements CanActivate {
  constructor(private ups: UsersPersistenceService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const userContext = ctx.getContext().req.user;
    const user = await this.ups.getUserById(userContext.user as string);

    if (!user.isProfessional) throw new UnauthorizedException(AuthorizationMessages.NOT_AUTHORIZED);
    return true;
  }
}
