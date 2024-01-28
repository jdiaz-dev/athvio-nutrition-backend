import { Injectable } from '@nestjs/common';
import { CreateCaloryDto } from 'src/modules/patients/calories/adapters/in/dtos/create-calory.dto';
import { CaloriesPersistenceService } from 'src/modules/patients/calories/adapters/out/calories-persistence.service';
import { Calory } from 'src/modules/patients/calories/adapters/out/calory.schema';
import { PatientsPersistenceService } from 'src/modules/patients/patients/adapters/out/patients-persistence.service';

@Injectable()
export class CreateCaloryService {
  constructor(private cps: PatientsPersistenceService, private caps: CaloriesPersistenceService) {}

  async createCalory(dto: CreateCaloryDto): Promise<Calory> {
    await this.cps.getPatientById(dto.patientId);
    const calory = await this.caps.createCalory(dto);
    return calory;
  }
}
