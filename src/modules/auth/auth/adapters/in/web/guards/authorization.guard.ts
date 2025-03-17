import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthorizationGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): GqlExecutionContext {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req as GqlExecutionContext; ///very important to work with graphql
  }
}
