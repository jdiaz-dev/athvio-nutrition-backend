import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/security/security/adapters/in/guards/authorization.guard';
import { SignUpUserDto } from 'src/modules/security/users/adapters/in/dtos/sign-up-user.dto';
import { UpdatePasswordDto } from 'src/modules/security/users/adapters/in/dtos/update-password.dto';
import { UpdateUserDto } from 'src/modules/security/users/adapters/in/dtos/update-user.dto';
import { User } from 'src/modules/security/users/adapters/out/user.schema';
import { UsersPersistenceService } from 'src/modules/security/users/adapters/out/users-persistence.service';
import { UserManagementService } from 'src/modules/security/users/application/user-management.service';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';

@Resolver()
export class UsersResolver {
  constructor(private ums: UserManagementService, private ups: UsersPersistenceService) {}

  @Mutation(() => User)
  async signUp(@Args('input') dto: SignUpUserDto, @Context() context: any): Promise<User> {
    context;
    return await this.ums.createUserAndProfessional(dto);
  }

  @UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
  @Mutation(() => User)
  async updateUser(@Args('input') dto: UpdateUserDto) {
    return this.ups.updateUser(dto);
  }

  @UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
  @Mutation(() => User)
  async updatePassword(@Args('input') dto: UpdatePasswordDto) {
    return this.ums.updatePassword(dto);
  }
}
