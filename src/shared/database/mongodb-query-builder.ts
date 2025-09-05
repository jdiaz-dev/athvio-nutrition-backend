import { InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { LayersServer } from 'src/shared/enums/project';
import { InternalErrors } from 'src/shared/enums/messages-response';
import { MongodbRepository } from 'src/shared/database/mongodb-repository';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Trazability } from 'src/shared/types';

export class MongodbQueryBuilder<T> {
  constructor(
    private readonly model: Model<any>,
    protected readonly logger: AthvioLoggerService,
    private readonly modelName: string,
    protected readonly als: AsyncLocalStorage<Trazability>,
  ) {}

  protected initializeQuery(callerMethodName: string): MongodbRepository<T> {
    return new MongodbRepository<T>(this.model, this.logger, callerMethodName, this.errorHandler.bind(this));
  }
  private errorHandler(error: unknown, callerMethodName: string, mongodbOperation: string): never {
    this.logger.error({
      traceId: this.als.getStore().traceId,
      layer: LayersServer.INFRAESTRUCTURE,
      trace: `${this.modelName}.${callerMethodName}.${mongodbOperation}`,
      message: (error as Error).message,
      stack: (error as Error).stack,
      error,
    });
    throw new InternalServerErrorException(InternalErrors.DATABASE);
  }
}
