import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetClientsDto } from 'src/modules/clients/clients/adapters/in/dtos/get-clients.dto';
import { Client, ClientDocument } from 'src/modules/clients/clients/adapters/out/client.schema';
import { ErrorClientsEnum } from 'src/shared/enums/messages-response';
import { ManageClientStateDto } from 'src/modules/clients/clients/adapters/in/dtos/manage-client-state.dto';
import { ManageClientGroupDto } from 'src/modules/clients/clients/adapters/in/dtos/manage-client-group.dto';
import { ClientState, ManageClientGroup } from 'src/shared/enums/project';
import { CreateClient, UpdateClient } from 'src/modules/clients/clients/adapters/out/client.types';

@Injectable()
export class ClientsPersistenceService {
  constructor(@InjectModel(Client.name) private readonly clientModel: Model<ClientDocument>) {}

  async createClient({ professionalId, ...body }: CreateClient): Promise<Client> {
    const client = await this.clientModel.create({
      professionalId,
      ...body,
    });
    return client;
  }
  async getClient(professionalId: string, clientId: string) {
    const client = await this.clientModel.findOne({
      _id: clientId,
      professionalId,
      state: ClientState.ACTIVE,
    });
    if (!client) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);
    return client;
  }
  async getClientById(clientId: string) {
    const client = await this.clientModel.findOne({
      _id: clientId,
      state: ClientState.ACTIVE,
    });
    if (!client) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);
    return client;
  }
  async getClients({ professionalId, ...dto }: GetClientsDto, selectors: string[]): Promise<Client[]> {
    const clients = await this.clientModel.find(
      {
        professionalId,
        state: dto.state,
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
  async updateClient({ clientId, professionalId, ...rest }: UpdateClient, selectors: string[]): Promise<Client> {
    const client = await this.clientModel.findOneAndUpdate(
      { _id: clientId, professionalId },
      { ...rest },
      { projection: selectors, new: true },
    );

    if (client == null) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);
    return client;
  }
  async updateClientGroup({ professionalId, clientId, action, groupId }: ManageClientGroupDto): Promise<Client> {
    const _action = action === ManageClientGroup.ADD ? { $push: { groups: groupId } } : { $pull: { groups: groupId } };

    const client = await this.clientModel.findOneAndUpdate({ _id: clientId, professionalId }, _action, {
      new: true,
      populate: 'groups',
    });
    if (client == null) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);

    return client;
  }
  async manageClientState({ professionalId, ...dto }: ManageClientStateDto, selectors: string[]): Promise<Client> {
    const client = await this.clientModel.findOneAndUpdate(
      {
        _id: dto.clientId,
        professionalId,
      },
      { state: dto.state },
      { projection: selectors },
    );

    if (client == null) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);

    return client;
  }
}
