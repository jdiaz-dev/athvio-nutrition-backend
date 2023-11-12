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
import { Plan } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ProgramPatial } from 'src/modules/professionals/programs/adapters/out/program.types';

@Injectable()
export class AssignProgramService {
  constructor(
    private cps: ClientsPersistenceService,
    private cpps: ClientPlansPersistenceService,
    private pps: PlansPersistenceService,
    private prps: ProgramsPersistenceService
  ) {}

  private prepareClientPlanBodies(plans: Plan[], dto: AssignProgramDto): ClientPlanPartial[] {
    const clientPlans: ClientPlanPartial[] = [];

    let clientPlan: ClientPlanPartial;
    for (const client of dto.clients) {
      for (const plan of plans) {
        const precitionDay = plan.day - dto.startingDay;
        clientPlan = {
          assignedDate: new Date(dayjs(dto.assignmentStartDate).set('date', dayjs(dto.assignmentStartDate).get('date') + precitionDay).toString()),
          client: client,
          meals: plan.meals
        };
        clientPlans.push(clientPlan);
      }
    }
    return clientPlans;
  }
  private async manageProgramSyncronization(newClientPlans: ClientPlanPartial[], program: ProgramPatial) {
    const clientPlansToSearch: ClientWithAssignedDate[] = newClientPlans.map((clientPlan) => ({ client: clientPlan.client, assignedDate: clientPlan.assignedDate, isDeleted: false }));

    if (program.isSyncActive && program.clients.length === 0) {
      //TODO: remove clientPlans and full again clientPlans
    } else {
      const clientPlans = await this.cpps.getManyClientPlans(clientPlansToSearch, { _id: 1, assignedDate: 1 });
      newClientPlans = newClientPlans.filter((newClientPlan) => {
        let clientPlanFound = clientPlans.filter((clientPlan) => newClientPlan.assignedDate.toString() === clientPlan.assignedDate.toString()
        );
        return clientPlanFound.length >= 1 ? 0 : 1;
      });
    }
  }
  async assignProgramToClient(dto: AssignProgramDto): Promise<ClientPlan[]> {
    await this.cps.getManyClientsById(dto.clients);
    const program = await this.pps.getProgramPlanFilteredByDay({ professional: dto.professional, program: dto.program, day: dto.startingDay }, planSelectors);
    const newClientPlans: ClientPlanPartial[] = this.prepareClientPlanBodies(program.plans, dto);

    await this.manageProgramSyncronization(newClientPlans, program);
    const res = await this.cpps.createManyClientPlan(newClientPlans);
    await this.prps.updateProgramClients(dto.program, dto.professional, dto.clients);
    return res;
  }

}
