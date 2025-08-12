import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { MongodbQueryBuilder } from 'src/shared/database/mongodb-query-builder';
import {
  WorkFlowStreamAudit,
  WorkFlowStreamAuditDocument,
} from 'src/modules/backoffice/work-steram-audit/adapters/out/work-flow-stream-audit.schema';

@Injectable()
export class WorkFlowStreamAuditPersistenceService extends MongodbQueryBuilder<WorkFlowStreamAuditDocument> {
  constructor(
    @InjectModel(WorkFlowStreamAudit.name) protected readonly questionaryModel: Model<WorkFlowStreamAuditDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(questionaryModel, logger, WorkFlowStreamAudit.name);
  }
  async createWorkFlowStreamAudit(
    data: Pick<WorkFlowStreamAudit, 'uuid' | 'path' | 'operation' | 'body'>,
  ): Promise<WorkFlowStreamAudit> {
    const questionaryRes = await this.initializeQuery(this.createWorkFlowStreamAudit.name).create(data);
    return questionaryRes;
  }
  async updateWorkFlowStreamAudit({
    uuid,
    ...rest
  }: Pick<WorkFlowStreamAudit, 'uuid'> & Partial<Pick<WorkFlowStreamAudit, 'response' | 'error'>>): Promise<WorkFlowStreamAudit> {
    const questionaryRes = await this.initializeQuery(this.updateWorkFlowStreamAudit.name).findOneAndUpdate(
      { uuid },
      { ...rest },
      { new: true },
    );
    return questionaryRes;
  }
}
