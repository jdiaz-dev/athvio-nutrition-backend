import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IUserContext } from '../interfaces/user-context';

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext): IUserContext => {
  const ctx = GqlExecutionContext.create(context);
  return ctx.getContext().req.user as IUserContext;
});
