import { BadRequestException, Injectable } from '@nestjs/common';
import { GetPatientQuestionaryDto } from 'src/modules/questionaries/patient-questionaries/adapters/in/dtos/get-patient-questionary.dto';
import { UpdateAnswerAndAdditionalNotesDto } from 'src/modules/questionaries/patient-questionaries/adapters/in/dtos/update-answer-and-additional-notes.dto';
import { PatientQuestionaryPersistenceService } from 'src/modules/questionaries/patient-questionaries/adapters/out/patient-questionary-persistence.service';
import { PatientQuestionary } from 'src/modules/questionaries/patient-questionaries/adapters/out/patient-questionary.schema';
import { CreatePatientQuestionary } from 'src/modules/questionaries/patient-questionaries/adapters/out/questionary-config';
import { ErrorPatientQuestionaryEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class PatientQuestionaryManagerService {
  constructor(private readonly pqps: PatientQuestionaryPersistenceService) {}

  async createQuestionary(patientQuestionary: CreatePatientQuestionary): Promise<PatientQuestionary> {
    const questionaryCreated = await this.pqps.createPatientQuestionary(patientQuestionary);
    return questionaryCreated;
  }
  async getPatientQuestionary(dto: GetPatientQuestionaryDto, selector: Record<string, number>): Promise<PatientQuestionary> {
    const questionary = await this.pqps.getPatientQuestionary(dto, selector);
    return questionary;
  }
  async updateAnswerAndAdditionalNotes(
    dto: UpdateAnswerAndAdditionalNotesDto,
    selectors: Record<string, number>,
  ): Promise<PatientQuestionary> {
    const questionary = await this.pqps.updateAnwerAndAdditionalNotes(dto, selectors);
    if (!questionary) throw new BadRequestException(ErrorPatientQuestionaryEnum.NOT_FOUND);
    return questionary;
  }
}
