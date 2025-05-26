import { BadRequestException, Injectable } from '@nestjs/common';
import { GetPatientManagerService } from 'src/modules/patients/patients/application/get-patient-manager.service';
import { SendPatientQuestionaryDto } from 'src/modules/questionaries/patient-questionaries/adapters/in/dtos/send-patient-questionary.dto';
import { PatientQuestionaryPersistenceService } from 'src/modules/questionaries/patient-questionaries/adapters/out/patient-questionary-persistence.service';
import { ErrorPatientQuestionaryEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class SendPatientQuestionaryService {
  constructor(private readonly pqps: PatientQuestionaryPersistenceService, private readonly gpms: GetPatientManagerService) {}

  async sendPatientQuestionary({ questionary: _id, patient, professional }: SendPatientQuestionaryDto): Promise<boolean> {
    const questionary = await this.pqps.getPatientQuestionary({ _id, patient, professional });
    if (!questionary) throw new BadRequestException(ErrorPatientQuestionaryEnum.NOT_FOUND);
    const patientRes = await this.gpms.getPatient(patient, professional);
    patientRes;
    return true;
  }
}
