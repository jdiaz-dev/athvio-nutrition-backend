import { Injectable } from '@nestjs/common';
import { CreateClientPlanDto } from 'src/modules/clients/client-plans/adapters/in/dtos/client-plan/create-client-plan.dto';
import { ClientPlan } from 'src/modules/clients/client-plans/adapters/out/client-plan.schema';
import { ClientPlansPersistenceService } from 'src/modules/clients/client-plans/adapters/out/client-plans-persistence.service';
import { ClientsPersistenceService } from 'src/modules/clients/clients/adapters/out/clients-persistence.service';

@Injectable()
export class CreateClientPlanService {
  constructor(private cps: ClientsPersistenceService, private cpps: ClientPlansPersistenceService) {}

  async createClientPlan(dto: CreateClientPlanDto, userId: string): Promise<ClientPlan> {
    await this.cps.getClient(dto.clientId, userId);
    const clientPlan = await this.cpps.createClientPlan(dto);
    return clientPlan;
  }
}
