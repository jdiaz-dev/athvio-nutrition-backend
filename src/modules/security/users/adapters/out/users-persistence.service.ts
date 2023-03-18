import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUser, UpdatePassword, UpdateUser } from 'src/modules/security/users/adapters/out/users-types';
import { User, UserDocument } from 'src/modules/security/users/adapters/out/user.schema';
import { ErrorClientsEnum } from 'src/shared/enums/messages-response';
import { UpdateUserDto } from 'src/modules/security/users/adapters/in/dtos/update-user.dto';

@Injectable()
export class UsersPersistenceService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async createUser(dto: CreateUser): Promise<User> {
    const user = (await this.userModel.create(dto)).toJSON() as User;
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const client = await this.userModel.aggregate([
      {
        $match: {
          email,
        },
      },
      {
        $project: {
          _id: 1,
          password: 1,
          professionalId: 1,
          clientId: 1,
        },
      },
    ]);
    return client[0];
  }
  async getUserById(userId: string): Promise<User> {
    const client = await this.userModel.findOne(
      {
        _id: userId,
      },
      ['_id', 'isProfessional', 'professionalId', 'email'],
    );

    if (client == null) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);
    return client;
  }

  async updateUser({ userId, ...rest }: UpdateUser | UpdatePassword | UpdateUserDto): Promise<User> {
    const client = await this.userModel.findOneAndUpdate({ _id: userId }, { ...rest }, { new: true });

    if (client == null) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);
    return client;
  }
  /* async getClient(clientId: string, professionalId: string) {
    const client = await this.clientModel.findOne({
      _id: clientId,
      professionalId,
      isDeleted: false,
      state: ClientState.ACTIVE,
    });
    if (!client) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);
    return client;
  }
  async getClients(dto: GetClientsDto, professionalId: string, selectors: string[]): Promise<Client[]> {
    const clients = await this.clientModel.find(
      {
        professionalId,
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

  async updateClientGroup(
    { clientId, action, groupId }: ManageClientGroupDto,
    professionalId: string,
  ): Promise<Client> {
    const _action = action === ManageClientGroup.ADD ? { $push: { groups: groupId } } : { $pull: { groups: groupId } };

    const client = await this.clientModel.findOneAndUpdate({ _id: clientId, professionalId }, _action, {
      new: true,
      populate: 'groups',
    });
    if (client == null) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);

    return client;
  }
  async manageClientState(dto: ManageClientStateDto, professionalId: string, selectors: string[]): Promise<Client> {
    const client = await this.clientModel.findOneAndUpdate(
      {
        _id: dto.clientId,
        professionalId,
        isDeleted: false,
      },
      { state: dto.state },
      { projection: selectors },
    );

    if (client == null) throw new BadRequestException(ErrorClientsEnum.CLIENT_NOT_FOUND);

    return client;
  } */
}
