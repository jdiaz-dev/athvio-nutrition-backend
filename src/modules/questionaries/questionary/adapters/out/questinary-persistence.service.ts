import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { InternalErrors } from 'src/shared/enums/messages-response';
import { LayersServer } from 'src/shared/enums/project';

import { Questionary, QuestionaryDocument } from 'src/modules/questionaries/questionary/adapters/out/questionary.schema';

@Injectable()
export class QuestionaryPersistenceService {
  private layer = LayersServer.INFRAESTRUCTURE;

  constructor(@InjectModel(Questionary.name) private readonly questionary: Model<QuestionaryDocument>) {}
  async getQuestionary(): Promise<Questionary> {
    try {
      const questionaryRes = await this.questionary.findOne();
      return questionaryRes;
    } catch (e) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
}
