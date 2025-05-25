import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Questionary, QuestionaryDocument } from 'src/modules/questionaries/questionary/adapters/out/questionary.schema';
import { BaseRepository } from 'src/shared/database/base-repository';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';

@Injectable()
export class QuestionaryPersistenceService extends BaseRepository<QuestionaryDocument> {
  constructor(
    @InjectModel(Questionary.name) protected readonly questionaryModel: Model<QuestionaryDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(questionaryModel, logger, Questionary.name);
  }
  async getQuestionary(): Promise<Questionary> {
    const questionaryRes = await this.findOne();
    return questionaryRes;
  }
}
