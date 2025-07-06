import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IUserContext } from '../interfaces/user-context';

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext): IUserContext => {
  const ctx = GqlExecutionContext.create(context);
  console.log('---------ctx', ctx.getContext().req);
  return ctx.getContext().req.user as IUserContext;
});
