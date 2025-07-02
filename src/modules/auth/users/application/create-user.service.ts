import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/auth/users/adapters/out/user.schema';
import { UsersPersistenceService } from 'src/modules/auth/users/adapters/out/users-persistence.service';
import { UserEntity } from 'src/modules/auth/users/domain/userEntity';

@Injectable()
export class CreateUserService {
  constructor(private readonly ups: UsersPersistenceService) {}

  async createUser(user: UserEntity): Promise<User> {
    const userCreated = await this.ups.createUser(user);
    return userCreated;
  }
}
