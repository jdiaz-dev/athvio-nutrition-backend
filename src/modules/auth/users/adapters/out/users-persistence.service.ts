import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GetUserById, UpdatePassword, UpdateUser } from 'src/modules/auth/users/adapters/out/users-types';
import { User, UserDocument } from 'src/modules/auth/users/adapters/out/user.schema';
import { UpdateUserDto } from 'src/modules/auth/users/adapters/in/web/dtos/update-user.dto';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { MongodbQueryBuilder } from 'src/shared/database/mongodb-query-builder';

@Injectable()
export class UsersPersistenceService extends MongodbQueryBuilder<UserDocument> {
  constructor(
    @InjectModel(User.name) protected readonly userModel: Model<UserDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(userModel, logger, User.name);
  }

  async createUser(dto: Partial<User>): Promise<User> {
    const user = (await this.initializeQuery(this.createUser.name).create(dto)).toJSON() as User;
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const patient = await this.initializeQuery(this.getUserByEmail.name).aggregate([
      {
        $match: {
          email,
        },
      },
      {
        $project: {
          _id: 1,
          uuid: 1,
          role: 1,
          password: 1,
        },
      },
    ]);
    return patient[0] as User;
  }
  async getUserByIdentifier(identifier: { _id?: Types.ObjectId; uuid?: string }): Promise<GetUserById> {
    const _user = await this.initializeQuery(this.getUserByIdentifier.name).findOne(
      { ...identifier },
      {
        _id: 1,
        uuid: 1,
        firstname: 1,
        lastname: 1,
        role: 1,
        email: 1,
        isActive: 1,
      },
    );

    return _user;
  }

  async updateUser({ user, ...rest }: UpdateUser | UpdatePassword | UpdateUserDto): Promise<User> {
    const patient = await this.initializeQuery(this.updateUser.name).findOneAndUpdate({ uuid: user }, { ...rest }, { new: true });
    return patient;
  }
}
