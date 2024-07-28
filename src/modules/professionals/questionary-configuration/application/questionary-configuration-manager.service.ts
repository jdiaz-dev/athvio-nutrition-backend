import { AddQuestionaryDetailDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/add-questionary-details.dto';
import { globalQuestionary } from './questionary';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateQuestionary } from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config';
import { QuestionaryConfigPersistenceService } from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config-persistence.service';
import { QuestionaryConfig } from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config.schema';
import { ErrorQuestionaryConfig } from 'src/shared/enums/messages-response';
import { LayersServer } from 'src/shared/enums/project';
import { DeleteQuestionaryDetailDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/delete-questionary-details.dto';
import { UpdateQuestionaryDetailDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/update-questionary-details.dto copy';

@Injectable()
export class QuestionaryConfigManager {
  private layer = LayersServer.APPLICATION;

  constructor(private qcps: QuestionaryConfigPersistenceService) {}

  async createQuestionary(professional: string): Promise<QuestionaryConfig> {
    const questionary: CreateQuestionary = {
      professional,
      ...globalQuestionary,
    };

    const questionaryCreated = await this.qcps.createQuestionary(questionary);

    return questionaryCreated;
  }
  async getQuestionaryConfig(professional: string, selector: Record<string, number>): Promise<QuestionaryConfig> {
    const questionary = await this.qcps.getQuestionaryConfig(professional, selector);
    return questionary;
  }
  async addQuestionaryDetail(
    { questionary, professional, questionaryGroup, questionaryDetailInput }: AddQuestionaryDetailDto,
    selector: Record<string, number>,
  ) {
    const _questionary = await this.qcps.addQuestionaryDetail(
      {
        questionary,
        professional,
        questionaryGroup,
        questionaryDetailBody: { ...questionaryDetailInput, enabled: true, fieldType: 'text' },
      },
      selector,
    );
    if (_questionary == null) throw new BadRequestException(ErrorQuestionaryConfig.QUESTIONARY_NOT_FOUND, this.layer);

    return _questionary;
  }
  async updateQuestionaryDetail(
    { questionary, professional, questionaryGroup, questionaryDetail, questionaryDetailInput }: UpdateQuestionaryDetailDto,
    selector: Record<string, number>,
  ) {
    const _questionary = await this.qcps.updateQuestionaryDetail(
      {
        questionary,
        professional,
        questionaryGroup,
        questionaryDetail,
        questionaryDetailBody: { ...questionaryDetailInput, fieldType: 'text' },
      },
      selector,
    );
    if (_questionary == null) throw new BadRequestException(ErrorQuestionaryConfig.QUESTIONARY_NOT_FOUND, this.layer);

    return _questionary;
  }
  async deleteQuestionaryDetail(dto: DeleteQuestionaryDetailDto, selector: Record<string, number>) {
    const _questionary = await this.qcps.deleteQuestionaryDetail({ ...dto }, selector);
    if (_questionary == null) throw new BadRequestException(ErrorQuestionaryConfig.QUESTIONARY_NOT_FOUND, this.layer);

    return _questionary;
  }
}
