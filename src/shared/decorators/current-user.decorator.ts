import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IUserContext } from '../interfaces/user-context';

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): IUserContext => {
  data;
  // console.log('---------context decorator', context.getArgs());
  const ctx = GqlExecutionContext.create(context);
  // console.log('---------ctx', ctx.getInfo().fieldNodes[0].arguments);
  // console.log('---------ctx', ctx.getInfo().fieldNodes[0].selectionSet);
  return ctx.getContext().req.user as IUserContext;
});
