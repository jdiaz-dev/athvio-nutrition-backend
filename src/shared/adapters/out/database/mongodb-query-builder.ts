import { InternalServerErrorException } from '@nestjs/common';
import {
  Aggregate,
  AggregateOptions,
  AnyKeys,
  FilterQuery,
  HydratedDocument,
  MergeType,
  Model,
  MongooseUpdateQueryOptions,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  QueryWithHelpers,
  UpdateQuery,
  UpdateWithAggregationPipeline,
  UpdateWriteOpResult,
} from 'mongoose';
import { UpdateOptions } from 'mongodb';

import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { LayersServer } from 'src/shared/enums/project';
import { InternalErrors } from 'src/shared/enums/messages-response';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Trazability } from 'src/shared/types';

export type BoundRepository<
  TRawDocType,
  TInstanceMethods = {},
  TQueryHelpers = {},
  THydratedDocumentType = HydratedDocument<TRawDocType, TInstanceMethods>,
> = {
  create(doc: AnyKeys<TRawDocType>): Promise<HydratedDocument<TRawDocType, TInstanceMethods>>;
  insertMany<DocContents = TRawDocType>(
    docs: Array<DocContents | TRawDocType>,
  ): Promise<Array<MergeType<THydratedDocumentType, Omit<DocContents, '_id'>>>>;
  findOne<ResultDoc = THydratedDocumentType>(
    filter?: FilterQuery<TRawDocType>,
    projection?: ProjectionType<TRawDocType> | null,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<QueryWithHelpers<ResultDoc | null, ResultDoc, TQueryHelpers, TRawDocType, 'findOne'>>;
  findOneAndUpdate<ResultDoc = HydratedDocument<TRawDocType, TInstanceMethods>>(
    filter?: FilterQuery<TRawDocType>,
    update?: UpdateQuery<TRawDocType>,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<ResultDoc | null>;
  find<ResultDoc = THydratedDocumentType>(
    filter: FilterQuery<TRawDocType>,
    projection?: ProjectionType<TRawDocType> | null,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<QueryWithHelpers<Array<ResultDoc>, ResultDoc, TQueryHelpers, TRawDocType, 'find'>>;
  aggregate<R = any>(pipeline?: PipelineStage[], options?: AggregateOptions): Promise<Aggregate<Array<R>>>;
  updateMany<ResultDoc = THydratedDocumentType>(
    filter?: FilterQuery<TRawDocType>,
    update?: UpdateQuery<TRawDocType> | UpdateWithAggregationPipeline,
    options?: (UpdateOptions & MongooseUpdateQueryOptions<TRawDocType>) | null,
  ): Promise<QueryWithHelpers<UpdateWriteOpResult, ResultDoc, TQueryHelpers, TRawDocType, 'updateMany'>>;
};

export class MongodbQueryBuilder<
  TRawDocType,
  TInstanceMethods = {},
  TQueryHelpers = {},
  THydratedDocumentType = HydratedDocument<TRawDocType, TInstanceMethods>,
> {
  constructor(
    protected readonly model: Model<TRawDocType>,
    protected readonly logger: AthvioLoggerService,
    protected readonly modelName: string,
    protected readonly als: AsyncLocalStorage<Trazability>,
  ) {}

  protected async create(
    callerMethodName: string,
    doc: AnyKeys<TRawDocType>,
  ): Promise<HydratedDocument<TRawDocType, TInstanceMethods>> {
    try {
      const record = await this.model.create(doc);
      return record as HydratedDocument<TRawDocType, TInstanceMethods>;
    } catch (error) {
      this.errorHandler(error, callerMethodName, this.create.name);
    }
  }

  protected async insertMany<DocContents = TRawDocType>(
    callerMethodName: string,
    docs: Array<DocContents | TRawDocType>,
  ): Promise<Array<MergeType<THydratedDocumentType, Omit<DocContents, '_id'>>>> {
    try {
      const records = await this.model.insertMany(docs);
      return records as Array<MergeType<THydratedDocumentType, Omit<DocContents, '_id'>>>;
    } catch (error) {
      this.errorHandler(error, callerMethodName, this.insertMany.name);
    }
  }

  protected async findOne<ResultDoc = THydratedDocumentType>(
    callerMethodName: string,
    filter?: FilterQuery<TRawDocType>,
    projection?: ProjectionType<TRawDocType> | null,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<QueryWithHelpers<ResultDoc | null, ResultDoc, TQueryHelpers, TRawDocType, 'findOne'>> {
    try {
      const record = await this.model.findOne(filter, projection, options);
      return record as QueryWithHelpers<ResultDoc | null, ResultDoc, TQueryHelpers, TRawDocType, 'findOne'>;
    } catch (error) {
      this.errorHandler(error, callerMethodName, this.findOne.name);
    }
  }

  protected async findOneAndUpdate<ResultDoc = HydratedDocument<TRawDocType, TInstanceMethods>>(
    callerMethodName: string,
    filter?: FilterQuery<TRawDocType>,
    update?: UpdateQuery<TRawDocType>,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<ResultDoc | null> {
    try {
      const result = await this.model.findOneAndUpdate(filter, update, options);
      return result as ResultDoc;
    } catch (error) {
      this.errorHandler(error, callerMethodName, this.findOneAndUpdate.name);
    }
  }

  protected async find<ResultDoc = THydratedDocumentType>(
    callerMethodName: string,
    filter: FilterQuery<TRawDocType>,
    projection?: ProjectionType<TRawDocType> | null | undefined,
    options?: QueryOptions<TRawDocType> | null | undefined,
  ): Promise<QueryWithHelpers<Array<ResultDoc>, ResultDoc, TQueryHelpers, TRawDocType, 'find'>> {
    try {
      const result = await this.model.find(filter, projection, options);
      return result as QueryWithHelpers<Array<ResultDoc>, ResultDoc, TQueryHelpers, TRawDocType, 'find'>;
    } catch (error) {
      this.errorHandler(error, callerMethodName, this.find.name);
    }
  }

  protected async aggregate<R = any>(
    callerMethodName: string,
    pipeline?: PipelineStage[],
    options?: AggregateOptions,
  ): Promise<Aggregate<Array<R>>> {
    try {
      return await this.model.aggregate(pipeline, options);
    } catch (error) {
      this.errorHandler(error, callerMethodName, this.aggregate.name);
    }
  }

  protected async updateMany<ResultDoc = THydratedDocumentType>(
    callerMethodName: string,
    filter?: FilterQuery<TRawDocType>,
    update?: UpdateQuery<TRawDocType> | UpdateWithAggregationPipeline,
    options?: (UpdateOptions & MongooseUpdateQueryOptions<TRawDocType>) | null,
  ): Promise<QueryWithHelpers<UpdateWriteOpResult, ResultDoc, TQueryHelpers, TRawDocType, 'updateMany'>> {
    try {
      const result = await this.model.updateMany(filter, update, options);
      return result as unknown as QueryWithHelpers<UpdateWriteOpResult, ResultDoc, TQueryHelpers, TRawDocType, 'updateMany'>;
    } catch (error) {
      this.errorHandler(error, callerMethodName, this.updateMany.name);
    }
  }

  protected initializeQuery(
    callerMethodName: string,
  ): BoundRepository<TRawDocType, TInstanceMethods, TQueryHelpers, THydratedDocumentType> {
    return new Proxy(this, {
      get(target, prop) {
        const original = target[prop as keyof typeof target];
        if (typeof original === 'function') {
          return (...args: unknown[]) => (original as Function).call(target, callerMethodName, ...args);
        }
        return original;
      },
    }) as unknown as BoundRepository<TRawDocType, TInstanceMethods, TQueryHelpers, THydratedDocumentType>;
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
