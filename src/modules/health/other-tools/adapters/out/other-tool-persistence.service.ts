import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AthvioLoggerService } from 'src/shared/adapters/observability/athvio-logger.service';
import { MongodbQueryBuilder } from 'src/shared/adapters/database/mongodb-query-builder';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Trazability } from 'src/shared/types';
import { OtherTool, OtherToolDocument } from 'src/modules/health/other-tools/adapters/out/other-tool.schema';

@Injectable()
export class OtherToolsPersistenceService extends MongodbQueryBuilder<OtherToolDocument> {
  constructor(
    @InjectModel(OtherTool.name) protected readonly otherToolModel: Model<OtherToolDocument>,
    protected readonly logger: AthvioLoggerService,
    protected readonly als: AsyncLocalStorage<Trazability>,
  ) {
    super(otherToolModel, logger, OtherTool.name, als);
  }

  async getOtherTools(selectors: Record<string, number>): Promise<OtherTool[]> {
    const otherTools = await this.initializeQuery(this.getOtherTools.name).find(
      {},
      {
        projection: {
          ...selectors,
        },
      },
    );
    return otherTools;
  }
}
