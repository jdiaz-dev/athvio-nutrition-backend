import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClientGroupDto } from 'src/modules/users/client-groups/adapters/in/dtos/create-client-group.dto';
import { DeleteClientGroupDto } from 'src/modules/users/client-groups/adapters/in/dtos/delete-client-group.dto';
import { UpdateClientGroupDto } from 'src/modules/users/client-groups/adapters/in/dtos/update-client-group.dto';
import { ClientGroup, ClientGroupDocument } from 'src/modules/users/client-groups/adapters/out/client-group.schema';
import { ErrorClientGroupEnum } from 'src/shared/enums/messages-bad-request';

@Injectable()
export class ClientGroupsPersistenceService {
  constructor(@InjectModel(ClientGroup.name) private readonly programTagModel: Model<ClientGroupDocument>) {}

  async createClientGroup(dto: CreateClientGroupDto, userId: string): Promise<ClientGroup> {
    const clientGroup = await this.programTagModel.create({
      userId,
      ...dto,
    });
    return clientGroup;
  }
  async getClientGroup(userId: string, groupId: string): Promise<ClientGroup> {
    const clientGroup = await this.programTagModel.findOne({
      _id: groupId,
      userId,
      isDeleted: false,
    });

    if (clientGroup == null) throw new BadRequestException(ErrorClientGroupEnum.CLIENT_GROUP_NOT_FOUND);

    return clientGroup;
  }
  async getClientGroups(userId: string): Promise<ClientGroup[]> {
    const clientGroups = await this.programTagModel.find({
      userId,
      isDeleted: false,
    });
    return clientGroups;
  }
  async updateClientGroup({ _id, ...rest }: UpdateClientGroupDto, userId: string): Promise<ClientGroup> {
    const clientGroup = await this.programTagModel.findOneAndUpdate(
      { _id, userId, isDeleted: false },
      { ...rest },
      { new: true },
    );

    if (clientGroup == null) throw new BadRequestException(ErrorClientGroupEnum.CLIENT_GROUP_NOT_FOUND);
    return clientGroup;
  }

  async deleteClientGroup(dto: DeleteClientGroupDto, userId: string): Promise<ClientGroup> {
    const clientGroup = await this.programTagModel.findOneAndUpdate({
      _id: dto._id,
      userId,
      isDeleted: true,
    });

    if (clientGroup == null) throw new BadRequestException(ErrorClientGroupEnum.CLIENT_GROUP_NOT_FOUND);

    return clientGroup;
  }
}
