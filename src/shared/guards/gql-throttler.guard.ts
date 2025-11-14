import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();

    if (!ctx.req) {
      // Handle cases where request object may not exist (e.g., subscriptions)
      return { req: ctx.connectionParams, res: null };
    }

    return { req: ctx.req, res: ctx.req.res };
  }
}
