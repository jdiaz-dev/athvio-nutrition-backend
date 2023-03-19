import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClientDto, CreateClientResponse } from 'src/modules/clients/clients/adapters/in/dtos/create-client.dto';
import { UpdateClientMobileDto } from 'src/modules/clients/clients/adapters/in/dtos/update-client.dto';
import { Client } from 'src/modules/clients/clients/adapters/out/client.schema';
import { ClientsPersistenceService } from 'src/modules/clients/clients/adapters/out/clients-persistence.service';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';
import { UserManagementService } from 'src/modules/security/users/application/user-management.service';
import { ClientState } from 'src/shared/enums/project';
import { ErrorUsersEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class ClientManagementService {
  constructor(
    private cps: ClientsPersistenceService,
    private ums: UserManagementService,
    private pms: ProfessionalsManagementService,
  ) {}

  async createClient({ professionalId, userInfo, additionalInfo }: CreateClientDto): Promise<CreateClientResponse> {
    const userEmail = await this.ums.getUserByEmail(userInfo.email);
    if (userEmail) throw new BadRequestException(ErrorUsersEnum.EMAIL_EXISTS);

    await this.pms.getProfessionalById(professionalId);

    const client = await this.cps.createClient({ professionalId, ...additionalInfo, isActive: true });
    const _user = {
      ...userInfo,
      clientId: client._id,
    };
    const user = await this.ums.createUserAndClient(_user);
    await this.cps.updateUser(client._id, user._id);

    const _client = {
      ...client,
      userInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
    return _client;
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
