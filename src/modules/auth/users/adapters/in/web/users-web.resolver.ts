import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { UpdateUserDto } from 'src/modules/auth/users/adapters/in/web/dtos/update-user.dto';
import { User } from 'src/modules/auth/users/adapters/out/user.schema';

import { UserManagamentService } from 'src/modules/auth/users/application/user-management.service';
import { AuthorizationProfessionalGuard } from 'src/shared/adapters/nestjs/guards/authorization-professional.guard';

@Resolver()
export class UsersWebResolver {
  constructor(private readonly ums: UserManagamentService) {}

  @UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
  @Mutation(() => User)
  updateUser(@Args('input') dto: UpdateUserDto): Promise<User> {
    return this.ums.updateUser(dto);
  }
}
