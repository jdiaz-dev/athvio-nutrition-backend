import { randomUUID } from 'node:crypto';
import { AddCustomQuestionaryDetailsDto } from 'src/modules/professionals/professional-questionaries/adapters/in/dtos/add-custom-questionary-details.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateQuestionary } from 'src/modules/professionals/professional-questionaries/adapters/out/professional-questionary';
import { ProfessionalInternalQuestionaryPersistenceService } from 'src/modules/professionals/professional-questionaries/adapters/out/professional-questionary-persistence.service';
import { ProfessionalQuestionary } from 'src/modules/professionals/professional-questionaries/adapters/out/professional-questionary.schema';
import { ErrorProfessionalQuestionary } from 'src/shared/enums/messages-response';
import { LayersServer } from 'src/shared/enums/project';
import { DeleteCustomQuestionaryDetailsDto } from 'src/modules/professionals/professional-questionaries/adapters/in/dtos/delete-custom-questionary-details.dto';
import { UpdateCustomQuestionaryDetailsDto } from 'src/modules/professionals/professional-questionaries/adapters/in/dtos/update-custom-questionary-details.dto';
import { EnableQuestionaryDetailsDto } from 'src/modules/professionals/professional-questionaries/adapters/in/dtos/enable-questionary-details.dto';
import { CustomQuestionaryDetailsPersistenceService } from 'src/modules/professionals/professional-questionaries/adapters/out/custom-questionary-details-persistence.service';
import { InternalQuestionaryPersistenceService } from 'src/modules/backoffice/internal-questionary/adapters/out/internal-questionary-persistence.service';

@Injectable()
export class ProfessionalQuestionaryManager {
  private layer = LayersServer.APPLICATION;

  constructor(
    private readonly qps: InternalQuestionaryPersistenceService,
    private qcps: ProfessionalInternalQuestionaryPersistenceService,
    private oqdp: CustomQuestionaryDetailsPersistenceService,
  ) {}

  async createQuestionary(professional: string): Promise<ProfessionalQuestionary> {
    const globalQuestionary = await this.qps.getQuestionary();
    const questionary: CreateQuestionary = {
      uuid: randomUUID(),
      professional,
      questionaryGroups: globalQuestionary.questionaryGroups.map(({ questionaryDetails, ...group }) => ({
        ...group,
        questionaryDetails: questionaryDetails.map((detail) => ({
          ...detail,
          uuid: randomUUID(),
        })),
        uuid: randomUUID(),
      })),
    };

    const questionaryCreated = await this.qcps.createQuestionary(questionary);
    return questionaryCreated;
  }
  async getProfessionalQuestionary(professional: string, selector?: Record<string, number>): Promise<ProfessionalQuestionary> {
    const questionary = await this.qcps.getProfessionalQuestionary(professional, selector);
    return questionary;
  }
  async enableQuestionaryDetails(
    dto: EnableQuestionaryDetailsDto,
    selectors: Record<string, number>,
  ): Promise<ProfessionalQuestionary> {
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
        questionaryDetailBodies: questionaryDetailsInput.map((item) => ({ uuid: randomUUID(), fieldType: 'text', ...item })),
      },
      selector,
    );
    if (!_questionary) throw new BadRequestException(ErrorProfessionalQuestionary.QUESTIONARY_NOT_FOUND, this.layer);

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
    if (!_questionary) throw new BadRequestException(ErrorProfessionalQuestionary.QUESTIONARY_NOT_FOUND, this.layer);

    return _questionary;
  }
  async deleteQuestionaryDetail(dto: DeleteCustomQuestionaryDetailsDto, selector: Record<string, number>) {
    const _questionary = await this.oqdp.deleteQuestionaryDetail({ ...dto }, selector);
    if (!_questionary) throw new BadRequestException(ErrorProfessionalQuestionary.QUESTIONARY_NOT_FOUND, this.layer);

    return _questionary;
  }
}
