import { ClientsPersistenceService } from './../../clients/adapters/out/clients-persistence.service';
import { Injectable } from '@nestjs/common';
import { AddClientPlanCommentDto } from 'src/modules/clients/client-plans/adapters/in/dtos/client-plan-comment/add-client-plan-comment.dto copy';
import { ClientPlanCommentPersistenceService } from 'src/modules/clients/client-plans/adapters/out/client-plan-comment-persistence.service';
import { ClientPlan } from 'src/modules/clients/client-plans/adapters/out/client-plan.schema';
import { CommenterType } from 'src/shared/enums/project';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';

@Injectable()
export class AddClientPlanCommentService {
  constructor(
    private pps: ProfessionalsPersistenceService,

    private cps: ClientsPersistenceService,
    private cpcps: ClientPlanCommentPersistenceService,
  ) {}

  async addClientPlanComment(dto: AddClientPlanCommentDto, selectors: string[]): Promise<ClientPlan> {
    if (dto.commenter.type === CommenterType.PROFESSIONAL) {
      await this.pps.getProfessionalById(dto.commenter.commenterId);
    } else {
      await this.cps.getClientById(dto.commenter.commenterId);
    }

    const clientPlan = await this.cpcps.addClientPlanComment(dto, selectors);
    return clientPlan;
  }
}
