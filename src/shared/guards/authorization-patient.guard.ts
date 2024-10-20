import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthorizationService } from 'src/modules/authentication/authentication/application/services/authorization.service';

@Injectable()
export class AuthorizationPatientGuard implements CanActivate {
  constructor(private ups: AuthorizationService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req.user;

    return await this.ups.verifyIfIsPatient(user);
  }
}
