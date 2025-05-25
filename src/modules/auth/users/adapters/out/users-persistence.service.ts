import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUser, GetUserById, UpdatePassword, UpdateUser } from 'src/modules/auth/users/adapters/out/users-types';
import { User, UserDocument } from 'src/modules/auth/users/adapters/out/user.schema';
import { UpdateUserDto } from 'src/modules/auth/users/adapters/in/web/dtos/update-user.dto';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { BaseRepository } from 'src/shared/database/base-repository';

@Injectable()
export class UsersPersistenceService extends BaseRepository<UserDocument> {
  constructor(
    @InjectModel(User.name) protected readonly userModel: Model<UserDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(userModel, logger, User.name);
  }

  async createUser(dto: CreateUser): Promise<User> {
    const user = (await this.create(dto)).toJSON() as User;
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const patient = await this.aggregate([
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
  }
  async getUserById(user: string): Promise<GetUserById> {
    const _user = await this.findOne(
      {
        _id: new Types.ObjectId(user),
      },
      ['_id', 'firstname', 'lastname', 'role', 'email', 'isActive'],
    );

    return _user;
  }

  async updateUser({ user, ...rest }: UpdateUser | UpdatePassword | UpdateUserDto): Promise<User> {
    const patient = await this.findOneAndUpdate({ _id: user }, { ...rest }, { new: true });
    return patient;
  }
}
