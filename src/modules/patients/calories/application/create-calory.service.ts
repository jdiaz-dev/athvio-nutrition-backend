import { Injectable } from '@nestjs/common';
import { CreateCaloryDto } from 'src/modules/patients/calories/adapters/in/dtos/create-calory.dto';
import { CaloriesPersistenceService } from 'src/modules/patients/calories/adapters/out/calories-persistence.service';
import { Calory } from 'src/modules/patients/calories/adapters/out/calory.schema';
import { GetPatientsService } from 'src/modules/patients/patients/application/get-patient.service';

@Injectable()
export class CreateCaloryService {
  constructor(private gps: GetPatientsService, private caps: CaloriesPersistenceService) {}

  async createCalory(dto: CreateCaloryDto): Promise<Calory> {
    await this.gps.getPatientById(dto.patientId);
    const calory = await this.caps.createCalory(dto);
    return calory;
  }
}
