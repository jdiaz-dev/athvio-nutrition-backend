import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  protected getRequestResponse(context: ExecutionContext) {
    if (context.getType<'graphql' | 'http' | string>() !== 'graphql') {
      return super.getRequestResponse(context);
    }

    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext() ?? {};

    const req =
      ctx.req ??
      ctx.request ??
      ctx.connectionParams;

    let res =
      ctx.res ??
      ctx.reply ??
      ctx.raw ??
      (ctx.req && ctx.req.res);

    if (!res) {
      res = {
        header: () => {},
        setHeader: () => {},
      };
    }

    return { req, res };
  }
}
