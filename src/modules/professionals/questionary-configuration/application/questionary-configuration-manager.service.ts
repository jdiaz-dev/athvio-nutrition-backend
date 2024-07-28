import { globalQuestionary } from './questionary';
import { Injectable } from '@nestjs/common';
import { CreateQuestionary } from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config';
import { QuestionaryConfigPersistenceService } from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config-persistence.service';
import { QuestionaryConfig } from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config.schema';

@Injectable()
export class QuestionaryConfigManager {
  constructor(private qcps: QuestionaryConfigPersistenceService) {}

  async createQuestionary(professional: string): Promise<QuestionaryConfig> {
    const questionary: CreateQuestionary = {
      professional,
      ...globalQuestionary,
    };

    const questionaryCreated = await this.qcps.createQuestionary(questionary);

    return questionaryCreated;
  }
  async getQuestionaryConfig(professional: string, selector: Record<string, number>): Promise<QuestionaryConfig> 
  {
    const questionary = await this.qcps.getQuestionaryConfig(professional, selector);
    return questionary;
  }

}
