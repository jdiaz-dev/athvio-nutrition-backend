import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { GetUserDto } from 'src/modules/authentication/users/adapters/in/web/dtos/get-user.dto';
import { UpdateUserDto } from 'src/modules/authentication/users/adapters/in/web/dtos/update-user.dto';
import { User } from 'src/modules/authentication/users/adapters/out/user.schema';
import { UsersPersistenceService } from 'src/modules/authentication/users/adapters/out/users-persistence.service';
import { GetUserById } from 'src/modules/authentication/users/adapters/out/users-types';
import { UserManagamentService } from 'src/modules/authentication/users/application/user-management.service';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';

@Resolver()
export class UsersWebResolver {
  constructor(private readonly ups: UsersPersistenceService, private readonly ums: UserManagamentService) {}

  @UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
  @Mutation(() => User)
  updateUser(@Args('input') dto: UpdateUserDto): Promise<User> {
    return this.ums.updateUser(dto);
  }
  @Query(() => User)
  getUser(@Args('input') dto: GetUserDto): Promise<GetUserById> {
    return this.ups.getUserById(dto.user);
  }
}
