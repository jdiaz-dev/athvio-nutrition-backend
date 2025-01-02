import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { GetUserDto } from 'src/modules/authentication/users/adapters/in/web/dtos/get-user.dto';
//TODO: check this dto
// import { UpdatePasswordDto } from 'src/modules/authentication/users/adapters/in/dtos/update-password.dto';
import { UpdateUserDto } from 'src/modules/authentication/users/adapters/in/web/dtos/update-user.dto';
import { User } from 'src/modules/authentication/users/adapters/out/user.schema';
import { UsersPersistenceService } from 'src/modules/authentication/users/adapters/out/users-persistence.service';
import { GetUserById } from 'src/modules/authentication/users/adapters/out/users-types';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';

@Resolver()
export class UsersWebResolver {
  constructor(private readonly ups: UsersPersistenceService) {}

  //TODO: remove AuthorizationProfessionalGuard
  @UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
  @Mutation(() => User)
  updateUser(@Args('input') dto: UpdateUserDto): Promise<User> {
    return this.ups.updateUser(dto);
  }
  @Query(() => User)
  getUser(@Args('input') dto: GetUserDto): Promise<GetUserById> {
    return this.ups.getUserById(dto.user);
  }
}
