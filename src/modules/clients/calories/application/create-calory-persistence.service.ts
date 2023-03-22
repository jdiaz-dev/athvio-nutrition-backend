import { Injectable } from '@nestjs/common';
import { CreateCaloryDto } from 'src/modules/clients/calories/adapters/in/dtos/create-calory.dto';
import { CaloriesPersistenceService } from 'src/modules/clients/calories/adapters/out/calories-persistence.service';
import { Calory } from 'src/modules/clients/calories/adapters/out/calory.schema';
import { ClientsPersistenceService } from 'src/modules/clients/clients/adapters/out/clients-persistence.service';

@Injectable()
export class CreateCaloryService {
  constructor(private cps: ClientsPersistenceService, private caps: CaloriesPersistenceService) {}

  async createCalory(dto: CreateCaloryDto): Promise<Calory> {
    await this.cps.getClientById(dto.clientId);
    const calory = await this.caps.createCalory(dto);
    return calory;
  }
}
