import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthenticationGuard extends AuthGuard('local') {
  constructor() {
    super();
  }
  getRequest(context: ExecutionContext): unknown {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext();
    request.body = ctx.getArgs().input;
    return request; ///very important to work with graphql
  }
}
