import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClientDto, CreateClientResponse } from 'src/modules/clients/clients/adapters/in/dtos/create-client.dto';
import { UpdateClientMobileDto } from 'src/modules/clients/clients/adapters/in/dtos/update-client.dto';
import { Client } from 'src/modules/clients/clients/adapters/out/client.schema';
import { ClientsPersistenceService } from 'src/modules/clients/clients/adapters/out/clients-persistence.service';
import { UserManagementService } from 'src/modules/security/users/application/user-management.service';
import { ClientState } from 'src/shared/enums/project';
import { ErrorUsersEnum } from 'src/shared/enums/messages-response';
import { CreateUser } from 'src/modules/security/users/adapters/out/users-types';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';
import { UsersPersistenceService } from 'src/modules/security/users/adapters/out/users-persistence.service';

@Injectable()
export class ClientManagementService {
  constructor(
    private cps: ClientsPersistenceService,
    private ums: UserManagementService,
    private ups: UsersPersistenceService,
    private pps: ProfessionalsPersistenceService,
  ) {}

  async createClient({ professional, userInfo, additionalInfo }: CreateClientDto): Promise<CreateClientResponse> {
    const userEmail = await this.ups.getUserByEmail(userInfo.email);
    if (userEmail) throw new BadRequestException(ErrorUsersEnum.EMAIL_EXISTS);

    await this.pps.getProfessionalById(professional);

    const client = await this.cps.createClient({ professional, ...additionalInfo, isActive: true });
    const _user: CreateUser = {
      ...userInfo,
      client: client._id,
    };
    
    if (additionalInfo.countryCode) _user.countryCode = additionalInfo.countryCode;
    if (additionalInfo.country) _user.country = additionalInfo.country;

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
