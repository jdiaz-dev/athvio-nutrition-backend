import { Injectable } from '@nestjs/common';
import { Client } from 'src/modules/clients/clients/adapters/out/client.schema';
import { ManageClientGroupDto } from 'src/modules/clients/clients/adapters/in/dtos/manage-client-group.dto';
import { ClientsPersistenceService } from 'src/modules/clients/clients/adapters/out/clients-persistence.service';
import { ClientGroupsPersistenceService } from 'src/modules/users/client-groups/adapters/out/client-groups-persistence.service';

@Injectable()
export class ManageClientGroupService {
  constructor(
    private cgps:ClientGroupsPersistenceService,
    private cps: ClientsPersistenceService) {}

  async manageClientGroup(dto: ManageClientGroupDto, userId: string): Promise<Client> {
    await this.cgps.getClientGroup(userId, dto.groupId);
    const client = await this.cps.updateClientGroup(dto, userId);
    return client;
  }
}
