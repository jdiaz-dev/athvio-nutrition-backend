import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUser, UpdatePassword, UpdateUser } from 'src/modules/authentication/users/adapters/out/users-types';
import { User, UserDocument } from 'src/modules/authentication/users/adapters/out/user.schema';
import { ErrorUsersEnum } from 'src/shared/enums/messages-response';
import { UpdateUserDto } from 'src/modules/authentication/users/adapters/in/dtos/update-user.dto';

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
          professional: 1,
          client: 1,
        },
      },
    ]);
    return client[0] as User;
  }
  async getUserById(user: string): Promise<User> {
    const _user = await this.userModel.findOne(
      {
        _id: user,
      },
      ['_id', 'isProfessional', 'professional', 'email'],
    );

    if (_user == null) throw new BadRequestException(ErrorUsersEnum.USER_NOT_FOUND);
    return _user;
  }

  async updateUser({ user, ...rest }: UpdateUser | UpdatePassword | UpdateUserDto): Promise<User> {
    const client = await this.userModel.findOneAndUpdate({ _id: user }, { ...rest }, { new: true });

    if (client == null) throw new BadRequestException(ErrorUsersEnum.USER_NOT_FOUND);
    return client;
  }
}
