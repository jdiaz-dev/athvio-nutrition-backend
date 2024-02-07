import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { UpdatePasswordDto } from 'src/modules/authentication/users/adapters/in/dtos/update-password.dto';
import { UpdateUserDto } from 'src/modules/authentication/users/adapters/in/dtos/update-user.dto';
import { User } from 'src/modules/authentication/users/adapters/out/user.schema';
import { UsersPersistenceService } from 'src/modules/authentication/users/adapters/out/users-persistence.service';
import { PatientService } from 'src/modules/authentication/users/application/patient.service';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';

@Resolver()
export class UsersResolver {
  constructor(private cs:PatientService, private ups: UsersPersistenceService) {}

  //TODO: remove AuthorizationProfessionalGuard
  @UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
  @Mutation(() => User)
  updateUser(@Args('input') dto: UpdateUserDto): Promise<User> {
    return this.ups.updateUser(dto);
  }

  //TODO: remove AuthorizationProfessionalGuard
  @UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
  @Mutation(() => User)
  updatePassword(@Args('input') dto: UpdatePasswordDto): Promise<User> {
    return this.cs.updatePassword(dto);
  }

  // TODO: activate user, add guard
  @Mutation(() => User)
  activateUser(){

  }
}
