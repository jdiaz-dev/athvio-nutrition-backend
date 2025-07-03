import { Injectable } from '@nestjs/common';
import { EnumRoles } from 'src/modules/auth/shared/enums';
import { User } from 'src/modules/auth/users/adapters/out/user.schema';
import { UsersPersistenceService } from 'src/modules/auth/users/adapters/out/users-persistence.service';
import { UserEntity } from 'src/modules/auth/users/domain/userEntity';

@Injectable()
export class CreateUserService {
  constructor(private readonly ups: UsersPersistenceService) {}

  async createUserForProfessionals({
    email,
    firstname,
    lastname,
    password,
    ...rest
  }: Omit<UserEntity, 'isActive' | 'role'>): Promise<User> {
    const userEntity = new UserEntity(email, EnumRoles.PROFESSIONAL, true, firstname, lastname, password);
    if (rest.countryCode) userEntity.countryCode = rest.countryCode;
    if (rest.country) userEntity.country = rest.country;
    if (rest.phone) userEntity.phone = rest.phone;
    if (rest.acceptedTerms) userEntity.acceptedTerms = rest.acceptedTerms;

    const userCreated = await this.ups.createUser(userEntity);
    return userCreated;
  }
  async createUserForWebPatient({
    email,
    firstname,
    lastname,
    ...rest
  }: Pick<UserEntity, 'email' | 'firstname' | 'lastname'> & Partial<Pick<UserEntity, 'country' | 'countryCode'>>): Promise<User> {
    const userEntity = new UserEntity(email, EnumRoles.PATIENT, false, firstname, lastname);
    if (rest.countryCode) userEntity.countryCode = rest.countryCode;
    if (rest.country) userEntity.country = rest.country;

    const userCreated = await this.ups.createUser(userEntity);
    return userCreated;
  }
  async createUserForMobilePatient({ email, password }: Pick<UserEntity, 'email' | 'password'>): Promise<User> {
    const userEntity = new UserEntity(email, EnumRoles.PATIENT, false);
    userEntity.password = password;

    const userCreated = await this.ups.createUser(userEntity);
    return userCreated;
  }
}
