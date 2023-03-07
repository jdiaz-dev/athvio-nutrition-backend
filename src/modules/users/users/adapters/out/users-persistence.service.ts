import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';

import { CreateUserInput } from 'src/modules/users/programs/adapters/out/inputs/create-user.input';
import { ErrorUsersEnum } from 'src/shared/enums/messages-bad-request';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersPersistenceService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(user: CreateUserInput) {
    const userExists = await this.userModel.findOne({ email: user.email });

    if (userExists) throw new BadRequestException(ErrorUsersEnum.EMAIL_EXISTS);

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(user.password, salt);
    return (await this.userModel.create(user)).toJSON();
  }
  getUser(email: string) {
    return this.userModel.findOne({ email }).select('_id firstName lastName password templateDarkMode');
  }
  getUserEmail(email: string): any {
    return this.userModel.findOne({ email }).select('_id email');
  }
  updateTemplateMode() {}
}
