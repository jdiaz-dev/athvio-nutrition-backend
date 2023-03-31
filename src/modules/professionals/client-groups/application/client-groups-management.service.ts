import { Injectable } from '@nestjs/common';
import { ClientsPersistenceService } from 'src/modules/clients/clients/adapters/out/clients-persistence.service';
import { CreateClientGroupDto } from 'src/modules/professionals/client-groups/adapters/in/dtos/create-client-group.dto';
import { DeleteClientGroupDto } from 'src/modules/professionals/client-groups/adapters/in/dtos/delete-client-group.dto';
import { ClientGroup } from 'src/modules/professionals/client-groups/adapters/out/client-group.schema';
import { ClientGroupsPersistenceService } from 'src/modules/professionals/client-groups/adapters/out/client-groups-persistence.service';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';

@Injectable()
export class ClientGroupsManagementService {
  constructor(
    private cps: ClientsPersistenceService,
    private cgps: ClientGroupsPersistenceService,
    private pps: ProfessionalsPersistenceService,
  ) {}

  async createClientGroup(dto: CreateClientGroupDto): Promise<ClientGroup> {
    await this.pps.getProfessionalById(dto.professional);
    const clientGroup = await this.cgps.createClientGroup(dto);

    return clientGroup;
  }
  async deleteClientGroup(dto: DeleteClientGroupDto) {
    await this.cps.deleteManyClientGroup({
      professional: dto.professional,
      clientGroup: dto.clientGroup,
    });
    return this.cgps.deleteClientGroup(dto);
  }
}
