import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const loggerMiddleware: FieldMiddleware = async (ctx: MiddlewareContext, next: NextFn) => {
  ctx;
  const value = await next();
  console.log('---------loggerMiddleware', value[0]);
  return value[0]; //we can control this value before to return
};
