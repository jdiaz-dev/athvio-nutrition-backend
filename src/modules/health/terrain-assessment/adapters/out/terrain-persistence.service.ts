import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AsyncLocalStorage } from 'node:async_hooks';
import {
  TerrainAssessment,
  TerrainAssessmentDocument,
} from 'src/modules/health/terrain-assessment/adapters/out/terrain-assesment.schema';
import { MongodbQueryBuilder } from 'src/shared/adapters/database/mongodb-query-builder';
import { AthvioLoggerService } from 'src/shared/adapters/observability/athvio-logger.service';
import { Trazability } from 'src/shared/types';

@Injectable()
export class TerrainAssessmentPersistence extends MongodbQueryBuilder<TerrainAssessmentDocument> {
  constructor(
    @InjectModel(TerrainAssessment.name)
    protected readonly model: Model<TerrainAssessmentDocument>,
    protected readonly logger: AthvioLoggerService,
    protected readonly als: AsyncLocalStorage<Trazability>,
  ) {
    super(model, logger, TerrainAssessment.name, als);
  }

  async findAssessment(): Promise<TerrainAssessmentDocument | null> {
    const assessment = await this.initializeQuery(this.findAssessment.name).findOne();
    return assessment.toJSON();
  }
}
