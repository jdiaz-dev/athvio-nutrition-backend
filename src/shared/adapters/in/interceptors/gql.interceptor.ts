import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { WorkFlowStreamAuditManagerService } from 'src/modules/backoffice/work-steram-audit/application/work-stream-audit-manager.service';
import { randomUUID } from 'node:crypto';

type AnyObj = Record<string, any>;
const maskKeys = ['password', 'token', 'authorization', 'refreshToken'];

@Injectable()
export class GqlInterceptor implements NestInterceptor {
  constructor(private readonly wfsams: WorkFlowStreamAuditManagerService) {}
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const gqlCtx = GqlExecutionContext.create(context);
    const info = gqlCtx.getInfo();
    const args = gqlCtx.getArgs();

    const uuid = randomUUID();
    await this.wfsams.createWorkFlowStreamAudit({
      uuid,
      operation: info.operation.operation,
      path: info.fieldName,
      body: JSON.stringify(this.mask(args)),
    });
    if (context.getType<'graphql'>() !== 'graphql') return next.handle();

    return next.handle().pipe(
      tap(async (data) => {
        const str = this.safeStringify(data);

        await this.wfsams.updateWorkFlowStreamAudit({
          uuid,
          response: `[json ${str.length} chars]`,
        });
      }),
      catchError(async (err) => {
        await this.wfsams.updateWorkFlowStreamAudit({
          uuid,
          error: JSON.stringify(err),
        });
        throw err;
      }),
    );
  }
  private safeStringify(v: any) {
    try {
      return JSON.stringify(v);
    } catch {
      return '[unserializable]';
    }
  }
  private mask(obj: AnyObj, keys = maskKeys) {
    try {
      const clone = JSON.parse(JSON.stringify(obj ?? {}));
      const deep = (o: AnyObj) => {
        for (const k of Object.keys(o || {})) {
          if (keys.includes(k.toLowerCase())) o[k] = '***';
          else if (o[k] && typeof o[k] === 'object') deep(o[k]);
        }
      };
      deep(clone);
      return clone;
    } catch {
      return obj;
    }
  }
}
