import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClientDto } from 'src/modules/clients/clients/adapters/in/dtos/create-client.dto';
import { GetClientsDto } from 'src/modules/clients/clients/adapters/in/dtos/get-clients.dto';
import { UpdateClientDto } from 'src/modules/clients/clients/adapters/in/dtos/update-client.dto';
import { Client, ClientDocument } from 'src/modules/clients/clients/adapters/out/client.schema';
import { ErrorClientsEnum } from 'src/shared/enums/messages-response';
import { ManageClientStateDto } from 'src/modules/clients/clients/adapters/in/dtos/manage-client-state.dto';
import { ManageClientGroupDto } from 'src/modules/clients/clients/adapters/in/dtos/manage-client-group.dto';
import { ClientState, ManageClientGroup } from 'src/shared/enums/project';

@Injectable()
export class ClientsPersistenceService {
  constructor(@InjectModel(Client.name) private readonly clientModel: Model<ClientDocument>) {}

  async createClient(dto: CreateClientDto, userId: string): Promise<Client> {
    const client = await this.clientModel.create({
      userId,
      ...dto,
    });
    return client;
  }
  async getClient(clientId: string, userId: string) {
    const client = await this.clientModel.findOne({
      _id: clientId,
      userId,
      isDeleted: false,
      state: ClientState.ACTIVE,

    });
    if (!client) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);
    return client;
  }
  async getClients(dto: GetClientsDto, userId: string, selectors: string[]): Promise<Client[]> {
    const clients = await this.clientModel.find(
      {
        userId,
        state: dto.state,
        isDeleted: false,
      },
      selectors,
      {
        limit: dto.limit,
        skip: dto.offset,
        sort: dto.orderBy,
      },
    );
    return clients;
  }
  async updateClient({ clientId, ...rest }: UpdateClientDto, userId: string, selectors: string[]): Promise<Client> {
    const client = await this.clientModel.findOneAndUpdate(
      { _id: clientId, userId, isDeleted: false },
      { ...rest },
      { projection: selectors, new: true },
    );

    if (client == null) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);
    return client;
  }
  async updateClientGroup({ clientId, action, groupId }: ManageClientGroupDto, userId: string): Promise<Client> {
    const _action = action === ManageClientGroup.ADD ? { $push: { groups: groupId } } : { $pull: { groups: groupId } };

    const client = await this.clientModel.findOneAndUpdate({ _id: clientId, userId }, _action, {
      new: true,
      populate: 'groups',
    });
    if (client == null) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);

    return client;
  }
  async manageClientState(dto: ManageClientStateDto, userId: string, selectors: string[]): Promise<Client> {
    const client = await this.clientModel.findOneAndUpdate(
      {
        _id: dto.clientId,
        userId,
        isDeleted: false,
      },
      { state: dto.state },
      { projection: selectors },
    );

    if (client == null) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);

    return client;
  }
}
