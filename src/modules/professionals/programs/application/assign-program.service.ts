import { Injectable } from '@nestjs/common';
import { ClientPlanPartial, ClientWithAssignedDate } from 'src/modules/clients/client-plans/adapters/out/client-plan.type';
import { ClientPlansPersistenceService } from 'src/modules/clients/client-plans/adapters/out/client-plans-persistence.service';
import { ClientsPersistenceService } from 'src/modules/clients/clients/adapters/out/clients-persistence.service';
import { AssignProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/assign-program.dto';
import { PlansPersistenceService } from 'src/modules/professionals/programs/adapters/out/plans-persistence.service';
import dayjs from 'dayjs';
import { ClientPlan } from 'src/modules/clients/client-plans/adapters/out/client-plan.schema';
import { planSelectors } from 'src/shared/enums/selectors';
import { ProgramsPersistenceService } from 'src/modules/professionals/programs/adapters/out/programs-persistence.service';

@Injectable()
export class AssignProgramService {
  constructor(
    private cps: ClientsPersistenceService,
    private cpps: ClientPlansPersistenceService,
    private pps: PlansPersistenceService,
    private prps: ProgramsPersistenceService
  ) {}

  async assignProgramToClient(dto: AssignProgramDto): Promise<ClientPlan[]> {
    await this.cps.getManyClientsById(dto.clients);
    const program = await this.pps.getProgramPlanFilteredByDay({ professional: dto.professional, program: dto.program, day: dto.startingDay }, planSelectors);
    const clientPlans: ClientPlanPartial[] = [];

    let clientPlan: ClientPlanPartial;
    for (const client of dto.clients) {
      for (const plan of program.plans) {
        const presitionDay = plan.day - dto.startingDay;
        clientPlan = {
          assignedDate: new Date(dayjs(dto.assignmentStartDate).set('date', dayjs(dto.assignmentStartDate).get('date') + presitionDay).toString()),
          client: client,
          meals: plan.meals
        };
        clientPlans.push(clientPlan);
      }
    }

    const clientPlansToSearch: ClientWithAssignedDate[] = clientPlans.map((clientPlan) => ({ client: clientPlan.client, assignedDate: clientPlan.assignedDate, isDeleted: false }));

    await this.cpps.getManyClientPlans(clientPlansToSearch, { _id: 1, assignedDate: 1 });
    const res = await this.cpps.createManyClientPlan(clientPlans);
    await this.prps.updateProgramClients(dto.program, dto.professional, dto.clients);
    return res;
  }

}
