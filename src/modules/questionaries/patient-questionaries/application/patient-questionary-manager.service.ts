import { Injectable } from '@nestjs/common';
import { GetPatientQuestionaryDto } from 'src/modules/questionaries/patient-questionaries/adapters/in/dtos/get-patient-questionary.dto';
import { PatientQuestionaryPersistenceService } from 'src/modules/questionaries/patient-questionaries/adapters/out/patient-questionary-persistence.service';
import { PatientQuestionary } from 'src/modules/questionaries/patient-questionaries/adapters/out/patient-questionary.schema';
import { CreatePatientQuestionary } from 'src/modules/questionaries/patient-questionaries/adapters/out/questionary-config';

@Injectable()
export class PatientQuestionaryManager {
  constructor(private pqps: PatientQuestionaryPersistenceService) {}

  async createQuestionary(patientQuestionary: CreatePatientQuestionary): Promise<PatientQuestionary> {
    const questionaryCreated = await this.pqps.createPatientQuestionary(patientQuestionary);
    return questionaryCreated;
  }
  async getPatientQuestionary(dto: GetPatientQuestionaryDto, selector: Record<string, number>): Promise<PatientQuestionary> {
    const questionary = await this.pqps.getPatientQuestionary(dto.patient, selector);
    return questionary;
  }
}
