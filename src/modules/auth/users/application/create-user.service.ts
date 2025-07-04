import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { EnumRoles } from 'src/modules/auth/shared/enums';
import { User } from 'src/modules/auth/users/adapters/out/user.schema';
import { UsersPersistenceService } from 'src/modules/auth/users/adapters/out/users-persistence.service';
import { UserEntity } from 'src/modules/auth/users/domain/user-entity';
import { UserEmail } from 'src/modules/auth/users/domain/user-email';
import { UserForProfessional } from 'src/modules/auth/users/types/user-entity.';
@Injectable()
export class CreateUserService {
  constructor(private readonly ups: UsersPersistenceService) {}

  async createUserForProfessional(
    _email: string,
    { firstname, lastname, password, ...rest }: UserForProfessional,
  ): Promise<User> {
    const userEntity = new UserEntity(
      randomUUID(),
      new UserEmail(_email),
      EnumRoles.PROFESSIONAL,
      true,
      firstname,
      lastname,
      password,
    );
    if (rest.countryCode) userEntity.countryCode = rest.countryCode;
    if (rest.country) userEntity.country = rest.country;
    if (rest.phone) userEntity.phone = rest.phone;
    if (rest.acceptedTerms) userEntity.acceptedTerms = rest.acceptedTerms;
    userEntity.validateUserCreationForProfessional();

    const { email, ...restEntity } = userEntity;
    const userCreated = await this.ups.createUser({ email: email.value, ...restEntity });
    return userCreated;
  }
  async createUserForWebPatient(
    _email: string,
    {
      firstname,
      lastname,
      ...rest
    }: Pick<UserEntity, 'firstname' | 'lastname'> & Partial<Pick<UserEntity, 'country' | 'countryCode'>>,
  ): Promise<User> {
    const userEntity = new UserEntity(randomUUID(), new UserEmail(_email), EnumRoles.PATIENT, false, firstname, lastname);
    if (rest.countryCode) userEntity.countryCode = rest.countryCode;
    if (rest.country) userEntity.country = rest.country;
    userEntity.validateUserCreationForWebPatient();

    const { email, ...restEntity } = userEntity;
    const userCreated = await this.ups.createUser({ email: email.value, ...restEntity });
    return userCreated;
  }
  async createUserForMobilePatient(_email: string, { password }: Pick<UserEntity, 'password'>): Promise<User> {
    const userEntity = new UserEntity(randomUUID(), new UserEmail(_email), EnumRoles.PATIENT, false);
    userEntity.password = password;
    userEntity.validateUserForMobilePatient();

    const { email, ...restEntity } = userEntity;
    const userCreated = await this.ups.createUser({ email: email.value, ...restEntity });
    return userCreated;
  }
}
