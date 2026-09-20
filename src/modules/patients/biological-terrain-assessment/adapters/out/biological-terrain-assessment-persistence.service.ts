import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AsyncLocalStorage } from 'node:async_hooks';
import {
  BiologicalTerrainAssessment,
  BiologicalTerrainAssessmentDocument,
} from 'src/modules/patients/biological-terrain-assessment/adapters/out/biological-terrain-assesment.schema';

import { MongodbQueryBuilder } from 'src/shared/adapters/database/mongodb-query-builder';
import { AthvioLoggerService } from 'src/shared/adapters/observability/athvio-logger.service';
import { Trazability } from 'src/shared/types';

@Injectable()
export class BiologicalTerrainAssessmentPersistence extends MongodbQueryBuilder<BiologicalTerrainAssessmentDocument> {
  constructor(
    @InjectModel(BiologicalTerrainAssessment.name)
    protected readonly model: Model<BiologicalTerrainAssessmentDocument>,
    protected readonly logger: AthvioLoggerService,
    protected readonly als: AsyncLocalStorage<Trazability>,
  ) {
    super(model, logger, BiologicalTerrainAssessment.name, als);
  }
  async createAssessment(assessment: Omit<BiologicalTerrainAssessment, '_id'>): Promise<BiologicalTerrainAssessment> {
    const questionaryRes = await this.initializeQuery(this.createAssessment.name).create(assessment);
    return questionaryRes;
  }
  async getAssessment(): Promise<BiologicalTerrainAssessment | null> {
    return await this.initializeQuery(this.getAssessment.name).findOne();
  }
}
