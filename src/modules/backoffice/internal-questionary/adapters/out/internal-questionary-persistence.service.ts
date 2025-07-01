import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import {
  InternalQuestionary,
  InternalQuestionaryDocument,
} from 'src/modules/backoffice/internal-questionary/adapters/out/internal-questionary.schema';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { MongodbQueryBuilder } from 'src/shared/database/mongodb-query-builder';

@Injectable()
export class InternalQuestionaryPersistenceService extends MongodbQueryBuilder<InternalQuestionaryDocument> {
  constructor(
    @InjectModel(InternalQuestionary.name) protected readonly questionaryModel: Model<InternalQuestionaryDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(questionaryModel, logger, InternalQuestionary.name);
  }
  async getQuestionary(): Promise<InternalQuestionary> {
    const questionaryRes = await this.startQuery(this.getQuestionary.name).findOne();
    return questionaryRes;
  }
}
