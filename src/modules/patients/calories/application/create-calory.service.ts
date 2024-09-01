import { Injectable } from '@nestjs/common';
import { CreateCaloryDto } from 'src/modules/patients/calories/adapters/in/dtos/create-calory.dto';
import { CaloriesPersistenceService } from 'src/modules/patients/calories/adapters/out/calories-persistence.service';
import { Calory } from 'src/modules/patients/calories/adapters/out/calory.schema';
import { PatientManagementService } from 'src/modules/patients/patients/application/patient-management.service';

@Injectable()
export class CreateCaloryService {
  constructor(private pms: PatientManagementService, private caps: CaloriesPersistenceService) {}

  async createCalory(dto: CreateCaloryDto): Promise<Calory> {

    //todo: add professional in dto
    //todo: leave only patient insetead of patientId
    await this.pms.getPatientById(dto.patientId);
    const calory = await this.caps.createCalory(dto);
    return calory;
  }
}
