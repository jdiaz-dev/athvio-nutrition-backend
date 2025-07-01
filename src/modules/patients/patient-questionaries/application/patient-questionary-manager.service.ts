import { BadRequestException, Injectable } from '@nestjs/common';
import { GetPatientQuestionaryByIdDto } from 'src/modules/patients/patient-questionaries/adapters/in/dtos/get-patient-questionary-by-id';
import { GetPatientQuestionaryDto } from 'src/modules/patients/patient-questionaries/adapters/in/dtos/get-patient-questionary.dto';
import { UpdateAnswersAndAdditionalNotesDto } from 'src/modules/patients/patient-questionaries/adapters/in/dtos/update-answers-and-additional-notes.dto';
import { UpdateAnswersDto } from 'src/modules/patients/patient-questionaries/adapters/in/dtos/update-answers.dto';
import { PatientInternalQuestionaryPersistenceService } from 'src/modules/patients/patient-questionaries/adapters/out/patient-questionary-persistence.service';
import { PatientQuestionary } from 'src/modules/patients/patient-questionaries/adapters/out/patient-questionary.schema';
import { CreatePatientQuestionary } from 'src/modules/patients/patient-questionaries/adapters/out/questionary-config';
import { ErrorPatientQuestionaryEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class PatientQuestionaryManagerService {
  constructor(private readonly pqps: PatientInternalQuestionaryPersistenceService) {}

  async createQuestionary(patientQuestionary: CreatePatientQuestionary): Promise<PatientQuestionary> {
    const questionaryCreated = await this.pqps.createPatientQuestionary(patientQuestionary);
    return questionaryCreated;
  }
  async getPatientQuestionary(
    { patient, professional }: GetPatientQuestionaryDto,
    selector: Record<string, number>,
  ): Promise<PatientQuestionary> {
    const questionary = await this.pqps.getPatientQuestionary({ patient, professional }, selector);
    return questionary;
  }
  async getPatientQuestionaryById(
    { questionary }: GetPatientQuestionaryByIdDto,
    selector: Record<string, number>,
  ): Promise<PatientQuestionary> {
    const questionaryRes = await this.pqps.getPatientQuestionary({ _id: questionary }, selector);
    return questionaryRes;
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
