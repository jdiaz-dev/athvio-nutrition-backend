import { Injectable } from '@nestjs/common';
import { AddClientPlanCommentDto } from 'src/modules/clients/client-plans/adapters/in/dtos/client-plan-comment/add-client-plan-comment.dto copy';
import { ClientPlanCommentPersistenceService } from 'src/modules/clients/client-plans/adapters/out/client-plan-comment-persistence.service';
import { ClientPlan } from 'src/modules/clients/client-plans/adapters/out/client-plan.schema';
import { ClientManagementService } from 'src/modules/clients/clients/application/client-management.service';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';
import { CommenterType } from 'src/shared/enums/project';

@Injectable()
export class AddClientPlanCommentService {
  constructor(
    private pms: ProfessionalsManagementService,
    private cms: ClientManagementService,
    private cpcps: ClientPlanCommentPersistenceService,
  ) {}

  async addClientPlanComment(dto: AddClientPlanCommentDto, selectors: string[]): Promise<ClientPlan> {
    if (dto.commenter.type === CommenterType.PROFESSIONAL) {
      await this.pms.getProfessionalById(dto.commenter.commenterId);
    } else {
      await this.cms.getClientById(dto.commenter.commenterId);
    }

    const clientPlan = await this.cpcps.addClientPlanComment(dto, selectors);
    return clientPlan;
  }
}
