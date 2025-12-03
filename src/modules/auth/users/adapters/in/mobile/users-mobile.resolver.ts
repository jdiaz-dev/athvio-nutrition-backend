import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { GetPatientUser } from 'src/modules/auth/users/adapters/in/mobile/dtos/get-patient-user-info';

import { User } from 'src/modules/auth/users/adapters/out/user.schema';
import { UserManagamentService } from 'src/modules/auth/users/application/user-management.service';
import { AuthorizationPatientGuard } from 'src/shared/adapters/in/guards/authorization-patient.guard';

//todo: deprecate this class? , I am getting fullname and surnname patient from getPatientForMobile query
@Resolver()
export class UsersMobileResolver {
  constructor(private readonly ums: UserManagamentService) {}
  @UseGuards(...[AuthorizationGuard, AuthorizationPatientGuard])
  @Query(() => User)
  getPatientUserForMobile(@Args('input') dto: GetPatientUser) {
    return this.ums.getUserThroughPatient(dto.patient);
  }
}
