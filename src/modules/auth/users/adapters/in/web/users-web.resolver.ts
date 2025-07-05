import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { GetUserDto } from 'src/modules/auth/users/adapters/in/web/dtos/get-user.dto';
import { UpdateUserDto } from 'src/modules/auth/users/adapters/in/web/dtos/update-user.dto';
import { User } from 'src/modules/auth/users/adapters/out/user.schema';
import { GetUserById } from 'src/modules/auth/users/adapters/out/users-types';
import { UserManagamentService } from 'src/modules/auth/users/application/user-management.service';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';

@Resolver()
export class UsersWebResolver {
  constructor(private readonly ums: UserManagamentService) {}

  @UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
  @Mutation(() => User)
  updateUser(@Args('input') dto: UpdateUserDto): Promise<User> {
    return this.ums.updateUser(dto);
  }
  @UseGuards(...[AuthorizationGuard])
  @Query(() => User)
  getUser(@Args('input') dto: GetUserDto): Promise<GetUserById> {
    return this.ums.getUserById(dto.user);
  }
}
