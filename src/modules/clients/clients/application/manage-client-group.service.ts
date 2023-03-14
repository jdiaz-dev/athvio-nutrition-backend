import { Injectable } from '@nestjs/common';
import { Client } from 'src/modules/clients/clients/adapters/out/client.schema';
import { ManageClientGroupDto } from 'src/modules/clients/clients/adapters/in/dtos/manage-client-group.dto';
import { ClientsPersistenceService } from 'src/modules/clients/clients/adapters/out/clients-persistence.service';
import { ClientGroupsPersistenceService } from 'src/modules/professionals/client-groups/adapters/out/client-groups-persistence.service';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';

@Injectable()
export class ManageClientGroupService {
  constructor(
    private cgps: ClientGroupsPersistenceService,
    private cps: ClientsPersistenceService,
    private pms: ProfessionalsManagementService,
  ) {}

  async manageClientGroup(dto: ManageClientGroupDto): Promise<Client> {
    await this.pms.getProfessionalById(dto.professionalId);
    await this.cgps.getClientGroup(dto.professionalId, dto.groupId);
    const client = await this.cps.updateClientGroup(dto);
    return client;
  }
}
