import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { QuestionaryConfig, QuestionaryConfigDocument } from './questionary-config.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { InternalErrors } from 'src/shared/enums/messages-response';
import { CreateQuestionary } from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config';

@Injectable()
export class QuestionaryConfigPersistenceService {
  constructor(@InjectModel(QuestionaryConfig.name) private readonly questionaryConfig: Model<QuestionaryConfigDocument>) {
    this.questionaryConfig;
  }
  async createQuestionary(questionary: CreateQuestionary): Promise<QuestionaryConfig> {
    try {
      const questionaryRes = await this.questionaryConfig.create({
        ...questionary,
      });
      return questionaryRes;
    } catch (e) {
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async getQuestionaryConfig(professional: string, selector: Record<string, number>): Promise<QuestionaryConfig> {
    try {
      const questionaryRes = await this.questionaryConfig.findOne({ professional: new Types.ObjectId(professional) }, selector);
      return questionaryRes;
    } catch (e) {
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
}
