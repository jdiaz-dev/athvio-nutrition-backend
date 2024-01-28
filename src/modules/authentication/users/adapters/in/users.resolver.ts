import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { UpdatePasswordDto } from 'src/modules/authentication/users/adapters/in/dtos/update-password.dto';
import { UpdateUserDto } from 'src/modules/authentication/users/adapters/in/dtos/update-user.dto';
import { User } from 'src/modules/authentication/users/adapters/out/user.schema';
import { UsersPersistenceService } from 'src/modules/authentication/users/adapters/out/users-persistence.service';
import { ClientService } from 'src/modules/authentication/users/application/client.service';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';

@Resolver()
export class UsersResolver {
  constructor(private cs:ClientService, private ups: UsersPersistenceService) {}

  @UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
  @Mutation(() => User)
  updateUser(@Args('input') dto: UpdateUserDto): Promise<User> {
    return this.ups.updateUser(dto);
  }

  @UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
  @Mutation(() => User)
  updatePassword(@Args('input') dto: UpdatePasswordDto): Promise<User> {
    return this.cs.updatePassword(dto);
  }

  // TODO: activate user
  @Mutation(() => User)
  activateUser(){

  }
}
