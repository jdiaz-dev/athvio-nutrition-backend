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

  async createClientGroup({ professionalId, ...rest }: CreateClientGroupDto): Promise<ClientGroup> {
    const clientGroup = await this.programTagModel.create({
      professionalId,
      ...rest,
    });
    return clientGroup;
  }
  async getClientGroup(professionalId: string, groupId: string): Promise<ClientGroup> {
    const clientGroup = await this.programTagModel.findOne({
      _id: groupId,
      professionalId,
      isDeleted: false,
    });

    if (clientGroup == null) throw new BadRequestException(ErrorClientGroupEnum.CLIENT_GROUP_NOT_FOUND);

    return clientGroup;
  }
  async getClientGroups({ professionalId }: GetClientGroupsDto): Promise<ClientGroup[]> {
    const clientGroups = await this.programTagModel.find({
      professionalId,
      isDeleted: false,
    });
    return clientGroups;
  }
  async updateClientGroup({ professionalId, clientGroupId, ...rest }: UpdateClientGroupDto): Promise<ClientGroup> {
    const clientGroup = await this.programTagModel.findOneAndUpdate(
      { _id: clientGroupId, professionalId, isDeleted: false },
      { ...rest },
      { new: true },
    );

    if (clientGroup == null) throw new BadRequestException(ErrorClientGroupEnum.CLIENT_GROUP_NOT_FOUND);
    return clientGroup;
  }

  async deleteClientGroup({ professionalId, clientGroupId }: DeleteClientGroupDto): Promise<ClientGroup> {
    const clientGroup = await this.programTagModel.findOneAndUpdate({
      _id: clientGroupId,
      professionalId,
      isDeleted: true,
    });

    if (clientGroup == null) throw new BadRequestException(ErrorClientGroupEnum.CLIENT_GROUP_NOT_FOUND);

    return clientGroup;
  }
}
