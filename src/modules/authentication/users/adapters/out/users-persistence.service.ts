import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUser, GetUserById, UpdatePassword, UpdateUser } from 'src/modules/authentication/users/adapters/out/users-types';
import { User, UserDocument } from 'src/modules/authentication/users/adapters/out/user.schema';
import { ErrorUsersEnum, InternalErrors } from 'src/shared/enums/messages-response';
import { UpdateUserDto } from 'src/modules/authentication/users/adapters/in/web/dtos/update-user.dto';
import { LayersServer } from 'src/shared/enums/project';

@Injectable()
export class UsersPersistenceService {
  private layer = LayersServer.INFRAESTRUCTURE;

  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async createUser(dto: CreateUser): Promise<User> {
    try {
      const user = (await this.userModel.create(dto)).toJSON() as User;
      return user;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const patient = await this.userModel.aggregate([
        {
          $match: {
            email,
          },
        },
        {
          $project: {
            _id: 1,
            role: 1,
            password: 1,
          },
        },
      ]);
      return patient[0] as User;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
  async getUserById(user: string): Promise<GetUserById> {
    try {
      const _user = await this.userModel.findOne(
        {
          _id: new Types.ObjectId(user),
        },
        ['_id', 'firstname', 'lastname', 'role', 'email', 'isActive'],
      );

      if (_user === null) throw new NotFoundException(ErrorUsersEnum.USER_NOT_FOUND);
      return _user;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }

  async updateUser({ user, ...rest }: UpdateUser | UpdatePassword | UpdateUserDto): Promise<User> {
    try {
      const patient = await this.userModel.findOneAndUpdate({ _id: user }, { ...rest }, { new: true });
      return patient;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
}
