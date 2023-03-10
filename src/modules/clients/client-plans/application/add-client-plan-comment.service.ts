import { Injectable } from '@nestjs/common';
import { AddClientPlanCommentDto } from 'src/modules/clients/client-plans/adapters/in/dtos/client-plan-comment/add-client-plan-comment.dto copy';
import { ClientPlanCommentPersistenceService } from 'src/modules/clients/client-plans/adapters/out/client-plan-comment-persistence.service';
import { ClientPlan } from 'src/modules/clients/client-plans/adapters/out/client-plan.schema';
import { ClientsPersistenceService } from 'src/modules/clients/clients/adapters/out/clients-persistence.service';
import { UsersPersistenceService } from 'src/modules/users/users/adapters/out/users-persistence.service';
import { CommenterType } from 'src/shared/enums/project';

@Injectable()
export class AddClientPlanCommentService {
  constructor(
    private ups: UsersPersistenceService,
    private cps: ClientsPersistenceService,
    private cpcps: ClientPlanCommentPersistenceService,
  ) {}

  async addClientPlanComment(dto: AddClientPlanCommentDto, userId: string, selectors: string[]): Promise<ClientPlan> {
    if (dto.commenter.type === CommenterType.USER) {
      await this.ups.getUserById(dto.commenter.commenterId);
    } else {
      await this.cps.getClient(dto.commenter.commenterId, userId);
    }

    const clientPlan = await this.cpcps.addClientPlanComment(dto, selectors);
    return clientPlan;
  }
}
