import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const loggerMiddleware: FieldMiddleware = async (_ctx: MiddlewareContext, next: NextFn) => {
  const value = await next();
  return value[0]; //we can control this value before to return
};
