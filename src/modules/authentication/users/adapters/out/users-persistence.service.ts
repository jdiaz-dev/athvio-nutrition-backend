import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUser, GetUserById, UpdatePassword, UpdateUser } from 'src/modules/authentication/users/adapters/out/users-types';
import { User, UserDocument } from 'src/modules/authentication/users/adapters/out/user.schema';
import { InternalErrors } from 'src/shared/enums/messages-response';
import { UpdateUserDto } from 'src/modules/authentication/users/adapters/in/web/dtos/update-user.dto';
import { LayersServer } from 'src/shared/enums/project';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';

@Injectable()
export class UsersPersistenceService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly logger: AthvioLoggerService,
  ) {}

  async createUser(dto: CreateUser): Promise<User> {
    try {
      const user = (await this.userModel.create(dto)).toJSON() as User;
      return user;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
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
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
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

      return _user;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }

  async updateUser({ user, ...rest }: UpdateUser | UpdatePassword | UpdateUserDto): Promise<User> {
    try {
      const patient = await this.userModel.findOneAndUpdate({ _id: user }, { ...rest }, { new: true });
      return patient;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
}
