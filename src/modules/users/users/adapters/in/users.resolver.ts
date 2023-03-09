import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserDto } from 'src/modules/users/users/adapters/in/dtos/create-user.dto';
import { User } from 'src/modules/users/users/adapters/out/user.schema';
import { UsersPersistenceService } from 'src/modules/users/users/adapters/out/users-persistence.service';

@Resolver()
export class UsersResolver {
  constructor(private ups: UsersPersistenceService) {}
  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation(() => User)
  async createUser(@Args('input') dto: CreateUserDto) {
    const _user = await this.ups.createUser(dto);
    return _user;
  }
}
