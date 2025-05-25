import { InternalServerErrorException } from '@nestjs/common';
import {
  Aggregate,
  AggregateOptions,
  AnyKeys,
  FilterQuery,
  HydratedDocument,
  Model,
  PipelineStage,
  ProjectionType,
  QueryWithHelpers,
  UpdateQuery,
} from 'mongoose';
import { QueryOptions } from 'mongoose';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { LayersServer } from 'src/shared/enums/project';
import { InternalErrors } from 'src/shared/enums/messages-response';

export class BaseRepository<
  TRawDocType,
  TInstanceMethods = {},
  TQueryHelpers = {},
  THydratedDocumentType = HydratedDocument<TRawDocType, TInstanceMethods>,
> {
  constructor(
    protected readonly model: Model<TRawDocType>,
    protected readonly logger: AthvioLoggerService,
    protected readonly modelName: string,
  ) {}

  protected async create(doc: AnyKeys<TRawDocType>): Promise<HydratedDocument<TRawDocType, TInstanceMethods>> {
    try {
      const record = await this.model.create(doc);
      return record as HydratedDocument<TRawDocType, TInstanceMethods>;
    } catch (error) {
      this.handleError(error, 'create');
    }
  }
  protected async findOne<ResultDoc = THydratedDocumentType>(
    filter?: FilterQuery<TRawDocType>,
    projection?: ProjectionType<TRawDocType> | null,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<QueryWithHelpers<ResultDoc | null, ResultDoc, TQueryHelpers, TRawDocType, 'findOne'>> {
    try {
      const record = await this.model.findOne(filter, projection, options);
      return record as QueryWithHelpers<ResultDoc | null, ResultDoc, TQueryHelpers, TRawDocType, 'findOne'>;
    } catch (error) {
      this.handleError(error, 'findOne');
    }
  }
  protected async findOneAndUpdate<ResultDoc = HydratedDocument<TRawDocType, TInstanceMethods>>(
    filter?: FilterQuery<TRawDocType>,
    update?: UpdateQuery<TRawDocType>,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<ResultDoc | null> {
    try {
      const result = await this.model.findOneAndUpdate(filter, update, options).exec();
      return result as ResultDoc;
    } catch (error) {
      this.handleError(error, 'findOneAndUpdate');
      throw error;
    }
  }

  protected async aggregate<R = any>(pipeline?: PipelineStage[], options?: AggregateOptions): Promise<Aggregate<Array<R>>> {
    try {
      return await this.model.aggregate(pipeline, options);
    } catch (error) {
      this.handleError(error, 'aggregate');
    }
  }

  private handleError(error: unknown, operation: string): never {
    this.logger.error({
      layer: LayersServer.INFRAESTRUCTURE,
      operation: `${this.modelName}.${operation}`,
      message: (error as Error).message,
      error,
    });
    throw new InternalServerErrorException(InternalErrors.DATABASE);
  }
}
