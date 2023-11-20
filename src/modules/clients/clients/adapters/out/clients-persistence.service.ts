import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model, UpdateWriteOpResult, Types } from 'mongoose';
import { GetClientsDto, GetClientsResponse } from 'src/modules/clients/clients/adapters/in/dtos/get-clients.dto';
import { Client, ClientDocument } from 'src/modules/clients/clients/adapters/out/client.schema';
import { ErrorClientsEnum } from 'src/shared/enums/messages-response';
import { ManageClientStateDto } from 'src/modules/clients/clients/adapters/in/dtos/manage-client-state.dto';
import { ManageClientGroupDto } from 'src/modules/clients/clients/adapters/in/dtos/manage-client-group.dto';
import { ClientState, ManageClientGroup } from 'src/shared/enums/project';
import { CreateClient, DeleteManyClientGroup, UpdateClient } from 'src/modules/clients/clients/adapters/out/client.types';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { searchByFieldsGenerator } from 'src/shared/helpers/mongodb-helpers';

@Injectable()
export class ClientsPersistenceService {
  constructor(@InjectModel(Client.name) private readonly clientModel: Model<ClientDocument>) {}

  async createClient({ professional, ...body }: CreateClient): Promise<FlattenMaps<Client>> {
    const client = await this.clientModel.create({
      professional,
      ...body,
    });
    return client.toJSON();
  }
  async getClient(professional: string, client: string): Promise<Client> {
    const clientRes = await this.clientModel.findOne({
      _id: client,
      professional: professional,
      state: ClientState.ACTIVE,
    });
    if (!clientRes) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);
    return clientRes;
  }
  async getClientById(clientId: string): Promise<Client> {
    const clientRes = await this.clientModel.findOne({
      _id: clientId,
      state: ClientState.ACTIVE,
    });
    if (!clientRes) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);
    return clientRes;
  }
  async getManyClientsById(clients: string[]): Promise<Client[]> {
    const clientsRes = await this.clientModel.find({ _id: { $in: clients } }, { _id: 1 });
    if (clients.length !== clientsRes.length)
      throw new BadRequestException(ErrorClientsEnum.CLIENTS_TO_SEARCH_ERROR);

    return clientsRes;
  }
  async getClients({ professional, ...dto }: GetClientsDto, selectors: Record<string, number>):
    Promise<GetClientsResponse> {
    const fieldsToSearch = searchByFieldsGenerator(['user.firstName', 'user.lastName'], dto.search);
    const restFields = removeAttributesWithFieldNames(selectors, ['user']);
    const states = dto.state === ClientState.ACTIVE ? [
      { state: dto.state },
      { state: ClientState.INVITATION_PENDING },
    ] : [{ state: ClientState.ARCHIVED }];

    const clients = await this.clientModel.aggregate([
      {
        $match: {
          professional: new Types.ObjectId(professional),
          $or: states
        },
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
        //looking group for every _id contained in groups array
        $lookup: {
          from: 'ClientGroups',
          let: {
            letGroups: '$groups',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    {
                      $toString: '$_id',
                    },
                    '$$letGroups',
                  ],
                },
              },
            },
          ],
          as: 'groups',
        },
      },
      {
        $project: {
          // to get user as object instead of array
          user: {
            $arrayElemAt: ['$user', 0],
          },
          ...restFields,
        },
      },
      {
        $match: {
          $or: fieldsToSearch,
        },
      },
      {
        $facet: {
          data: [
            {
              $skip: dto.offset,
            },
            {
              $limit: dto.limit,
            },
            {
              $project: selectors,
            },
          ],
          meta: [{ $count: 'total' }],
        },
      },
      {
        $project: {
          data: 1,
          total: { $ifNull: [{ $arrayElemAt: ['$meta.total', 0] }, 0] },
        },
      },
    ]);

    const res: GetClientsResponse = {
      data: clients[0].data,
      meta: {
        total: clients[0].total,
        limit: dto.limit,
        offset: dto.offset,
      },
    };
    return res;
  }
  async updateClient({ client, professional, ...rest }: UpdateClient, selectors: string[]): Promise<Client> {
    const clientRes = await this.clientModel.findOneAndUpdate(
      { _id: client, professional },
      { ...rest },
      { projection: selectors, new: true },
    );

    if (clientRes == null) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);
    return clientRes;
  }
  async updateUser(clientId: string, userId: string): Promise<Client> {
    const clientRes = await this.clientModel.findOneAndUpdate({ _id: clientId }, { user: userId }, { new: true });

    if (clientRes == null) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);
    return clientRes;
  }
  async updateClientGroup({ professional, client, action, clientGroup }: ManageClientGroupDto): Promise<Client> {
    const _action = action === ManageClientGroup.ADD ? { $push: { groups: clientGroup } } : { $pull: { groups: clientGroup } };

    const clientRes = await this.clientModel.findOneAndUpdate({ _id: client, professional }, _action, {
      new: true,
      populate: 'groups',
    });
    if (clientRes == null) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);

    return clientRes;
  }
  async deleteManyClientGroup({ professional, clientGroup }: DeleteManyClientGroup): Promise<UpdateWriteOpResult> {
    const recordsUpdated = await this.clientModel.updateMany(
      { professional, groups: clientGroup },
      { $pull: { groups: clientGroup } },
    );
    return recordsUpdated;
  }
  async manageClientState({ professional, ...dto }: ManageClientStateDto, selectors: string[]): Promise<Client> {
    const clientRes = await this.clientModel.findOneAndUpdate(
      {
        _id: dto.client,
        professional: professional,
      },
      { state: dto.state },
      { projection: selectors },
    );

    if (clientRes == null) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);

    return clientRes;
  }
}
