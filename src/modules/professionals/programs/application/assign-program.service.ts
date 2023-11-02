import { Injectable } from '@nestjs/common';
import { ClientPlanPartial } from 'src/modules/clients/client-plans/adapters/out/client-plan.type';
import { ClientPlansPersistenceService } from 'src/modules/clients/client-plans/adapters/out/client-plans-persistence.service';
import { ClientsPersistenceService } from 'src/modules/clients/clients/adapters/out/clients-persistence.service';
import { AssignProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/assign-program.dto';
import { PlansPersistenceService } from 'src/modules/professionals/programs/adapters/out/plans-persistence.service';
import dayjs from 'dayjs';
import { ClientPlan } from 'src/modules/clients/client-plans/adapters/out/client-plan.schema';
import { planSelectors } from 'src/shared/enums/selectors';

@Injectable()
export class AssignProgramService {
  constructor(
    private cps: ClientsPersistenceService,
    private cpps: ClientPlansPersistenceService,
    private pps: PlansPersistenceService,
  ) {}

  async assignProgramToClient(dto: AssignProgramDto): Promise<ClientPlan[]> {
    await this.cps.getManyClientsById(dto.clients);
    const program = await this.pps.getProgramPlanFilteredByDay({ professional: dto.professional, program: dto.program, day: dto.startingDay }, planSelectors);

    const clientPlans: ClientPlanPartial[] = [];

    let clientPlan: ClientPlanPartial;
    for (const client of dto.clients) {
      let index = 0;
      for (const plan of program.plans) {
        clientPlan = {
          assignedDate: new Date(dayjs(dto.assignmentStartDay).set('date', dayjs(dto.assignmentStartDay).get('date') + index).toString()),
          client: client,
          meals: plan.meals
        };
        clientPlans.push(clientPlan);
        index++;
      }
    }

    const res = await this.cpps.createManyClientPlan(clientPlans);
    return res;
  }

}
