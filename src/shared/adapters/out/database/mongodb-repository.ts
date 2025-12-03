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
  QueryWithHelpers,
  UpdateQuery,
  UpdateWithAggregationPipeline,
  UpdateWriteOpResult,
} from 'mongoose';
import { QueryOptions } from 'mongoose';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { UpdateOptions } from 'mongodb';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MongodbRepository<
  TRawDocType,
  TInstanceMethods = {},
  TQueryHelpers = {},
  THydratedDocumentType = HydratedDocument<TRawDocType, TInstanceMethods>,
> {
  constructor(
    protected readonly model: Model<TRawDocType>,
    protected readonly logger: AthvioLoggerService,
    protected readonly callerMethodName: string,
    private readonly errorHandler?: (error: unknown, callerMethodName: string, mongodbOperation: string) => never,
  ) {}

  public async create(doc: AnyKeys<TRawDocType>): Promise<HydratedDocument<TRawDocType, TInstanceMethods>> {
    try {
      const record = await this.model.create(doc);
      return record as HydratedDocument<TRawDocType, TInstanceMethods>;
    } catch (error) {
      this.errorHandler(error, this.callerMethodName, this.create.name);
    }
  }
  public async insertMany<DocContents = TRawDocType>(
    docs: Array<DocContents | TRawDocType>,
  ): Promise<Array<MergeType<THydratedDocumentType, Omit<DocContents, '_id'>>>> {
    try {
      const records = await this.model.insertMany(docs);
      return records as Array<MergeType<THydratedDocumentType, Omit<DocContents, '_id'>>>;
    } catch (error) {
      this.errorHandler(error, this.callerMethodName, this.insertMany.name);
    }
  }
  public async findOne<ResultDoc = THydratedDocumentType>(
    filter?: FilterQuery<TRawDocType>,
    projection?: ProjectionType<TRawDocType> | null,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<QueryWithHelpers<ResultDoc | null, ResultDoc, TQueryHelpers, TRawDocType, 'findOne'>> {
    try {
      const record = await this.model.findOne(filter, projection, options);
      return record as QueryWithHelpers<ResultDoc | null, ResultDoc, TQueryHelpers, TRawDocType, 'findOne'>;
    } catch (error) {
      this.errorHandler(error, this.callerMethodName, this.findOne.name);
    }
  }
  public async findOneAndUpdate<ResultDoc = HydratedDocument<TRawDocType, TInstanceMethods>>(
    filter?: FilterQuery<TRawDocType>,
    update?: UpdateQuery<TRawDocType>,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<ResultDoc | null> {
    try {
      const result = await this.model.findOneAndUpdate(filter, update, options);
      return result as ResultDoc;
    } catch (error) {
      this.errorHandler(error, this.callerMethodName, this.findOneAndUpdate.name);
    }
  }
  public async find<ResultDoc = THydratedDocumentType>(
    filter: FilterQuery<TRawDocType>,
    projection?: ProjectionType<TRawDocType> | null | undefined,
    options?: QueryOptions<TRawDocType> | null | undefined,
  ): Promise<QueryWithHelpers<Array<ResultDoc>, ResultDoc, TQueryHelpers, TRawDocType, 'find'>> {
    try {
      const result = await this.model.find(filter, projection, options);
      return result as QueryWithHelpers<Array<ResultDoc>, ResultDoc, TQueryHelpers, TRawDocType, 'find'>;
    } catch (error) {
      this.errorHandler(error, this.callerMethodName, this.find.name);
    }
  }
  public async aggregate<R = any>(pipeline?: PipelineStage[], options?: AggregateOptions): Promise<Aggregate<Array<R>>> {
    try {
      return await this.model.aggregate(pipeline, options);
    } catch (error) {
      this.errorHandler(error, this.callerMethodName, this.aggregate.name);
    }
  }

  public async updateMany<ResultDoc = THydratedDocumentType>(
    filter?: FilterQuery<TRawDocType>,
    update?: UpdateQuery<TRawDocType> | UpdateWithAggregationPipeline,
    options?: (UpdateOptions & MongooseUpdateQueryOptions<TRawDocType>) | null,
  ): Promise<QueryWithHelpers<UpdateWriteOpResult, ResultDoc, TQueryHelpers, TRawDocType, 'updateMany'>> {
    try {
      const result = await this.model.updateMany(filter, update, options);
      return result as unknown as QueryWithHelpers<UpdateWriteOpResult, ResultDoc, TQueryHelpers, TRawDocType, 'updateMany'>;
    } catch (error) {
      this.errorHandler(error, this.callerMethodName, this.updateMany.name);
    }
  }
}
