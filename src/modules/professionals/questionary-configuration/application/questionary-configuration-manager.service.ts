import { AddCustomQuestionaryDetailsDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/add-custom-questionary-details.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateQuestionary } from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config';
import { QuestionaryConfigPersistenceService } from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config-persistence.service';
import { QuestionaryConfig } from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config.schema';
import { ErrorQuestionaryConfig } from 'src/shared/enums/messages-response';
import { LayersServer } from 'src/shared/enums/project';
import { DeleteCustomQuestionaryDetailsDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/delete-custom-questionary-details.dto';
import { UpdateCustomQuestionaryDetailsDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/update-custom-questionary-details.dto';
import { EnableQuestionaryDetailsDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/enable-questionary-details.dto';
import { CustomQuestionaryDetailsPersistenceService } from 'src/modules/professionals/questionary-configuration/adapters/out/custom-questionary-details-persistence.service';
import { QuestionaryPersistenceService } from 'src/modules/professionals/questionary/adapters/out/questinary-persistence.service';

@Injectable()
export class QuestionaryConfigManager {
  private layer = LayersServer.APPLICATION;

  constructor(
    private readonly qps: QuestionaryPersistenceService,
    private qcps: QuestionaryConfigPersistenceService,
    private oqdp: CustomQuestionaryDetailsPersistenceService,
  ) {}

  async createQuestionary(professional: string): Promise<QuestionaryConfig> {
    const globalQuestionary = await this.qps.getQuestionary();
    console.log('---------globalQuestionary', globalQuestionary);
    const questionary: CreateQuestionary = {
      professional,
      questionaryGroups: globalQuestionary.questionaryGroups,
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
    { questionary, professional, questionaryGroup, questionaryDetailsInput }: AddCustomQuestionaryDetailsDto,
    selector: Record<string, number>,
  ) {
    const _questionary = await this.oqdp.addQuestionaryDetail(
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
  async updateQuestionaryDetail(
    { questionary, professional, questionaryGroup, questionaryDetailsInput }: UpdateCustomQuestionaryDetailsDto,
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
  async deleteQuestionaryDetail(dto: DeleteCustomQuestionaryDetailsDto, selector: Record<string, number>) {
    const _questionary = await this.oqdp.deleteQuestionaryDetail({ ...dto }, selector);
    if (!_questionary) throw new BadRequestException(ErrorQuestionaryConfig.QUESTIONARY_NOT_FOUND, this.layer);

    return _questionary;
  }
}
