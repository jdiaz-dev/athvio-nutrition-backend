import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { GetPatientQuestionaryDto } from 'src/modules/patients/patient-questionaries/adapters/in/web/dtos/get-patient-questionary.dto';
import { UpdateAnswersAndAdditionalNotesDto } from 'src/modules/patients/patient-questionaries/adapters/in/web/dtos/update-answers-and-additional-notes.dto';
import { UpdateAnswersDto } from 'src/modules/patients/patient-questionaries/adapters/in/mobile/dtos/update-answers.dto';
import { PatientInternalQuestionaryPersistenceService } from 'src/modules/patients/patient-questionaries/adapters/out/patient-questionary-persistence.service';
import { PatientQuestionary } from 'src/modules/patients/patient-questionaries/adapters/out/patient-questionary.schema';
import { CreatePatientQuestionary } from 'src/modules/patients/patient-questionaries/adapters/out/questionary-config';
import { ErrorPatientQuestionaryEnum } from 'src/shared/enums/messages-response';
import { GetQuestionaryForPatientDto } from 'src/modules/patients/patient-questionaries/adapters/in/mobile/dtos/get-questionary-for-patient.dto';

@Injectable()
export class PatientQuestionaryManagerService {
  constructor(private readonly pqps: PatientInternalQuestionaryPersistenceService) {}

  async createQuestionary({
    questionaryGroups,
    ...restPatientQuestionary
  }: Omit<CreatePatientQuestionary, 'uuid'>): Promise<PatientQuestionary> {
    const questionaryCreated = await this.pqps.createPatientQuestionary({
      uuid: randomUUID(),
      ...restPatientQuestionary,
      questionaryGroups: questionaryGroups.map(({ questionaryDetails, ...restGroup }) => ({
        ...restGroup,
        uuid: randomUUID(),
        questionaryDetails: questionaryDetails.map((detail) => ({
          ...detail,
          uuid: randomUUID(),
        })),
      })),
    });
    return questionaryCreated;
  }
  async getPatientQuestionaryForProfessional(
    { patient, professional }: GetPatientQuestionaryDto,
    selector: Record<string, number>,
  ): Promise<PatientQuestionary> {
    const questionary = await this.pqps.getPatientQuestionary({ patient, professional }, selector);
    return questionary;
  }
  async getQuestionaryForPatient(
    { patient }: GetQuestionaryForPatientDto,
    selector: Record<string, number>,
  ): Promise<PatientQuestionary> {
    const questionary = await this.pqps.getPatientQuestionary({ patient }, selector);
    return questionary;
  }
  async updateAnswers(dto: UpdateAnswersDto, selectors: Record<string, number>): Promise<PatientQuestionary> {
    const questionary = await this.pqps.updateAnwerAndAdditionalNotes(dto, selectors);
    if (!questionary) throw new BadRequestException(ErrorPatientQuestionaryEnum.NOT_FOUND);
    return questionary;
  }
  async updateAnswerAndAdditionalNotes(
    dto: UpdateAnswersAndAdditionalNotesDto,
    selectors: Record<string, number>,
  ): Promise<PatientQuestionary> {
    const questionary = await this.pqps.updateAnwerAndAdditionalNotes(dto, selectors);
    if (!questionary) throw new BadRequestException(ErrorPatientQuestionaryEnum.NOT_FOUND);
    return questionary;
  }
}
