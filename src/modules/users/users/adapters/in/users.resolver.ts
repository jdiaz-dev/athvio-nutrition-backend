import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from 'src/modules/users/programs/adapters/out/inputs/create-user.input';
import { User } from '../out/user.schema';
import { UsersPersistenceService } from '../out/users-persistence.service';

@Resolver()
export class UsersResolver {
  constructor(private ups: UsersPersistenceService) {}
  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation(() => User)
  async createUser(@Args('input') user: CreateUserInput) {
    const _user = await this.ups.createUser(user);
    return _user;
  }
}
