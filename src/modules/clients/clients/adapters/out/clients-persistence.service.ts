import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model, UpdateWriteOpResult, Types } from 'mongoose';
import { GetClientsDto } from 'src/modules/clients/clients/adapters/in/dtos/get-clients.dto';
import { Client, ClientDocument } from 'src/modules/clients/clients/adapters/out/client.schema';
import { ErrorClientsEnum } from 'src/shared/enums/messages-response';
import { ManageClientStateDto } from 'src/modules/clients/clients/adapters/in/dtos/manage-client-state.dto';
import { ManageClientGroupDto } from 'src/modules/clients/clients/adapters/in/dtos/manage-client-group.dto';
import { ClientState, ManageClientGroup } from 'src/shared/enums/project';
import {
  CreateClient,
  DeleteManyClientGroup,
  UpdateClient,
} from 'src/modules/clients/clients/adapters/out/client.types';

@Injectable()
export class ClientsPersistenceService {
  constructor(@InjectModel(Client.name) private readonly clientModel: Model<ClientDocument>) {}

  async createClient({ professionalId, ...body }: CreateClient): Promise<FlattenMaps<Client>> {
    const client = await this.clientModel.create({
      professional: professionalId,
      ...body,
    });
    return client.toJSON();
  }
  async getClient(professionalId: string, clientId: string) {
    const client = await this.clientModel.findOne({
      _id: clientId,
      professional: professionalId,
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
    const clients = await this.clientModel.aggregate([
      {
        $match: {
          professional: new Types.ObjectId(professionalId),
          state: dto.state,
        },
      },
      {
        $limit: dto.limit,
      },
      {
        $skip: dto.offset,
      },
      {
        $lookup: {
          from: 'Users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $lookup: {
          from: 'ClientGroups',
          localField: 'groups',
          foreignField: '_id',
          as: 'groups',
        },
      },
      {
        $match: {
          $or: [{ 'user.firstName': new RegExp(dto.search) }, { 'user.lastName': new RegExp(dto.search) }],
        },
      },
      /* {
        $project: {
          user: {
            $arrayElemAt: ['$user', 0],
          },
          ...removeFieldFromAgregationSelectors(selectors, 'user'),
        },
      },
      {
        $project: selectors,
      }, */
    ]);
    selectors
    console.log('......clients', clients);
    return clients;
  }
  async updateClient({ clientId, professionalId, ...rest }: UpdateClient, selectors: string[]): Promise<Client> {
    const client = await this.clientModel.findOneAndUpdate(
      { _id: clientId, professional: professionalId },
      { ...rest },
      { projection: selectors, new: true },
    );

    if (client == null) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);
    return client;
  }
  async updateUser(clientId: string, userId: string): Promise<Client> {
    const client = await this.clientModel.findOneAndUpdate({ _id: clientId }, { user: userId }, { new: true });

    if (client == null) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);
    return client;
  }
  async updateClientGroup({ professionalId, clientId, action, clientGroupId }: ManageClientGroupDto): Promise<Client> {
    const _action =
      action === ManageClientGroup.ADD ? { $push: { groups: clientGroupId } } : { $pull: { groups: clientGroupId } };

    const client = await this.clientModel.findOneAndUpdate({ _id: clientId, professional: professionalId }, _action, {
      new: true,
      populate: 'groups',
    });
    if (client == null) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);

    return client;
  }
  async deleteManyClientGroup({ professionalId, clientGroupId }: DeleteManyClientGroup): Promise<UpdateWriteOpResult> {
    const recordsUpdated = await this.clientModel.updateMany(
      { professional: professionalId, groups: clientGroupId },
      { $pull: { groups: clientGroupId } },
    );
    return recordsUpdated;
  }
  async manageClientState({ professionalId, ...dto }: ManageClientStateDto, selectors: string[]): Promise<Client> {
    const client = await this.clientModel.findOneAndUpdate(
      {
        _id: dto.clientId,
        professional: professionalId,
      },
      { state: dto.state },
      { projection: selectors },
    );

    if (client == null) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);

    return client;
  }
}
