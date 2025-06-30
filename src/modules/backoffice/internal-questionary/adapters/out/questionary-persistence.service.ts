import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Questionary, QuestionaryDocument } from 'src/modules/backoffice/internal-questionary/adapters/out/questionary.schema';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { MongodbQueryBuilder } from 'src/shared/database/mongodb-query-builder';

@Injectable()
export class QuestionaryPersistenceService extends MongodbQueryBuilder<QuestionaryDocument> {
  constructor(
    @InjectModel(Questionary.name) protected readonly questionaryModel: Model<QuestionaryDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(questionaryModel, logger, Questionary.name);
  }
  async getQuestionary(): Promise<Questionary> {
    const questionaryRes = await this.startQuery(this.getQuestionary.name).findOne();
    return questionaryRes;
  }
}
