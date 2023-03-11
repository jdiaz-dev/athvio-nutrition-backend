import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthorizationGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext){
    const ctx = GqlExecutionContext.create(context)

    const req = ctx.getContext().req ///very important to work with graphql
    throw new InternalServerErrorException('feooooooooo')
    console.log('---------req authoriza', req);
    return req
  }
}
