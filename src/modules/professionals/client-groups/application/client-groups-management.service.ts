import { Injectable } from '@nestjs/common';
import { CreateClientGroupDto } from 'src/modules/professionals/client-groups/adapters/in/dtos/create-client-group.dto';
import { ClientGroup } from 'src/modules/professionals/client-groups/adapters/out/client-group.schema';
import { ClientGroupsPersistenceService } from 'src/modules/professionals/client-groups/adapters/out/client-groups-persistence.service';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';

@Injectable()
export class ClientGroupsManagementService {
  constructor(private cgps: ClientGroupsPersistenceService, private pms: ProfessionalsManagementService) {}

  async createClientGroup(dto: CreateClientGroupDto): Promise<ClientGroup> {
    await this.pms.getProfessionalById(dto.professionalId);
    const clientGroup = await this.cgps.createClientGroup(dto);

    return clientGroup;
  }
}
