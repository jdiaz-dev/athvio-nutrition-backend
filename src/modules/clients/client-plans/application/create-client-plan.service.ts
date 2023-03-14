import { Injectable } from '@nestjs/common';
import { CreateClientPlanDto } from 'src/modules/clients/client-plans/adapters/in/dtos/client-plan/create-client-plan.dto';
import { ClientPlan } from 'src/modules/clients/client-plans/adapters/out/client-plan.schema';
import { ClientPlansPersistenceService } from 'src/modules/clients/client-plans/adapters/out/client-plans-persistence.service';
import { ClientManagementService } from 'src/modules/clients/clients/application/client-management.service';

@Injectable()
export class CreateClientPlanService {
  constructor(private cms: ClientManagementService, private cpps: ClientPlansPersistenceService) {}

  async createClientPlan(dto: CreateClientPlanDto): Promise<ClientPlan> {
    await this.cms.getClientById(dto.clientId);
    const clientPlan = await this.cpps.createClientPlan(dto);
    return clientPlan;
  }
}
