import { AddOtherQuestionaryDetailDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/add-other-questionary-details.dto';
import { globalQuestionary } from './questionary';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateQuestionary } from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config';
import { QuestionaryConfigPersistenceService } from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config-persistence.service';
import { QuestionaryConfig } from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config.schema';
import { ErrorQuestionaryConfig } from 'src/shared/enums/messages-response';
import { LayersServer } from 'src/shared/enums/project';
import { DeleteOtherQuestionaryDetailDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/delete-other-questionary-details.dto';
import { UpdateOtherQuestionaryDetailDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/update-other-questionary-details.dto';
import { EnableQuestionaryDetailsDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/enable-questionary-details.dto';
import { OtherQuestionaryDetailsPersistenceService } from 'src/modules/professionals/questionary-configuration/adapters/out/other-questionary-details-persistence.service';

@Injectable()
export class QuestionaryConfigManager {
  private layer = LayersServer.APPLICATION;

  constructor(private qcps: QuestionaryConfigPersistenceService, private oqdp: OtherQuestionaryDetailsPersistenceService) {}

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
  async enableQuestionaryDetails(
    dto: EnableQuestionaryDetailsDto,
    selectors: Record<string, number>,
  ): Promise<QuestionaryConfig> {
    const questionary = await this.qcps.enableMultipleQuestionaryDetail(dto, selectors);
    return questionary;
  }
  async addQuestionaryDetail(
    { questionary, professional, questionaryGroup, questionaryDetailsInput }: AddOtherQuestionaryDetailDto,
    selector: Record<string, number>,
  ) {
    const _questionary = await this.oqdp.addQuestionaryDetail(
      {
        questionary,
        professional,
        questionaryGroup,
        questionaryDetailBodies: questionaryDetailsInput.map((item) => ({ ...item, isEnabled: true, fieldType: 'text' })),
      },
      selector,
    );
    if (!_questionary) throw new BadRequestException(ErrorQuestionaryConfig.QUESTIONARY_NOT_FOUND, this.layer);

    return _questionary;
  }
  async updateQuestionaryDetail(
    { questionary, professional, questionaryGroup, questionaryDetailsInput }: UpdateOtherQuestionaryDetailDto,
    selector: Record<string, number>,
  ) {
    const _questionary = await this.oqdp.updateQuestionaryDetail(
      {
        questionary,
        professional,
        questionaryGroup,
        questionaryDetailBodies: questionaryDetailsInput.map((item) => ({ ...item, fieldType: 'text' })),
      },
      selector,
    );
    if (!_questionary) throw new BadRequestException(ErrorQuestionaryConfig.QUESTIONARY_NOT_FOUND, this.layer);

    return _questionary;
  }
  async deleteQuestionaryDetail(dto: DeleteOtherQuestionaryDetailDto, selector: Record<string, number>) {
    const _questionary = await this.oqdp.deleteQuestionaryDetail({ ...dto }, selector);
    if (!_questionary) throw new BadRequestException(ErrorQuestionaryConfig.QUESTIONARY_NOT_FOUND, this.layer);

    return _questionary;
  }
}
