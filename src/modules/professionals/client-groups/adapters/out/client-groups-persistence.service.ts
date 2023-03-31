import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClientGroupDto } from 'src/modules/professionals/client-groups/adapters/in/dtos/create-client-group.dto';
import { DeleteClientGroupDto } from 'src/modules/professionals/client-groups/adapters/in/dtos/delete-client-group.dto';
import { GetClientGroupsDto } from 'src/modules/professionals/client-groups/adapters/in/dtos/get-client-groups.dto';
import { UpdateClientGroupDto } from 'src/modules/professionals/client-groups/adapters/in/dtos/update-client-group.dto';
import {
  ClientGroup,
  ClientGroupDocument,
} from 'src/modules/professionals/client-groups/adapters/out/client-group.schema';
import { ErrorClientGroupEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class ClientGroupsPersistenceService {
  constructor(@InjectModel(ClientGroup.name) private readonly programTagModel: Model<ClientGroupDocument>) {}

  async createClientGroup({ professional, ...rest }: CreateClientGroupDto): Promise<ClientGroup> {
    const clientGroup = await this.programTagModel.create({
      professional,
      ...rest,
    });
    return clientGroup;
  }
  async getClientGroup(professionalId: string, groupId: string): Promise<ClientGroup> {
    const clientGroup = await this.programTagModel.findOne({
      _id: groupId,
      professional: professionalId,
      isDeleted: false,
    });

    if (clientGroup == null) throw new BadRequestException(ErrorClientGroupEnum.CLIENT_GROUP_NOT_FOUND);

    return clientGroup;
  }
  async getClientGroups({ professional }: GetClientGroupsDto): Promise<ClientGroup[]> {
    const clientGroups = await this.programTagModel.find({
      professional,
      isDeleted: false,
    });
    return clientGroups;
  }
  async updateClientGroup({ professional, clientGroup, ...rest }: UpdateClientGroupDto): Promise<ClientGroup> {
    const clientGroupRes = await this.programTagModel.findOneAndUpdate(
      { _id: clientGroup, professional, isDeleted: false },
      { ...rest },
      { new: true },
    );

    if (clientGroup == null) throw new BadRequestException(ErrorClientGroupEnum.CLIENT_GROUP_NOT_FOUND);
    return clientGroupRes;
  }

  async deleteClientGroup({ professional, clientGroup }: DeleteClientGroupDto): Promise<ClientGroup> {
    const clientGroupRes = await this.programTagModel.findOneAndUpdate(
      {
        _id: clientGroup,
        professional,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        new: true,
      },
    );

    if (clientGroupRes == null) throw new BadRequestException(ErrorClientGroupEnum.CLIENT_GROUP_NOT_FOUND);

    return clientGroupRes;
  }
}
