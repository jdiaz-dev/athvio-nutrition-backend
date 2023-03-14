import { Injectable } from '@nestjs/common';
import { CreateClientDto } from 'src/modules/clients/clients/adapters/in/dtos/create-client.dto';
import { UpdateClientMobileDto } from 'src/modules/clients/clients/adapters/in/dtos/update-client.dto';
import { Client } from 'src/modules/clients/clients/adapters/out/client.schema';
import { ClientsPersistenceService } from 'src/modules/clients/clients/adapters/out/clients-persistence.service';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';
import { UserManagementService } from 'src/modules/security/users/application/user-management.service';
import { ClientState } from 'src/shared/enums/project';

@Injectable()
export class ClientManagementService {
  constructor(
    private cps: ClientsPersistenceService,
    private ums: UserManagementService,
    private pms: ProfessionalsManagementService,
  ) {}

  async createClient({ userInfo, ...clientInfo }: CreateClientDto): Promise<Client> {
    await this.pms.getProfessionalById(clientInfo.professionalId);
    const client = await this.cps.createClient({ ...clientInfo, isActive: true });
    const _user = {
      ...userInfo,
      clientId: client._id,
    };
    await this.ums.createUserAndClient(_user);
    return client;
  }
  async getClientById(clientId: string) {
    const client = await this.cps.getClientById(clientId);
    return client;
  }

  //without use still
  async activateClient({ updateUserInfo, ...rest }: UpdateClientMobileDto, selectors: string[]): Promise<Client> {
    await this.ums.activateUserAndClient(updateUserInfo);
    const _client = {
      ...rest,
      state: ClientState.ACTIVE,
      isActive: true,
    };
    const client = await this.cps.updateClient(_client, selectors);
    return client;
  }
}
