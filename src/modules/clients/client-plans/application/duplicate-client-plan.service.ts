import { Injectable } from '@nestjs/common';
import { DuplicateClientPlanDto } from 'src/modules/clients/client-plans/adapters/in/dtos/plan/duplicate-client-plan.dto';
import { ClientPlan } from 'src/modules/clients/client-plans/adapters/out/client-plan.schema';
import { ClientPlansPersistenceService } from 'src/modules/clients/client-plans/adapters/out/client-plans-persistence.service';

@Injectable()
export class DuplicateClientPlanService {
  constructor(
    private cpps: ClientPlansPersistenceService,
  ) {}

  async duplicateClientPlan({ professional, client, clientPlan, ...rest }: DuplicateClientPlanDto, selectors: Record<string, number>): Promise<ClientPlan> {
    const _clientPlan = await this.cpps.getClientPlan({ professional, client, clientPlan }, selectors);

    delete _clientPlan._id;
    delete _clientPlan.assignedDate;
    for (let x = 0; x < _clientPlan.meals.length; x++) {
      delete _clientPlan.meals[x]._id;
      delete _clientPlan.meals[x].updatedAt;
    }
    console.log('-------_clientPlan', _clientPlan);
    const programUpdated = await this.cpps.createClientPlan({ ..._clientPlan, professional, client, assignedDate: rest.assignedDate });
    return programUpdated;
  }
}
