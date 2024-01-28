import { Injectable } from '@nestjs/common';
import { UsersPersistenceService } from 'src/modules/authentication/users/adapters/out/users-persistence.service';
import * as bcryptjs from 'bcryptjs';
import { User } from 'src/modules/authentication/users/adapters/out/user.schema';
import { UpdateUser } from 'src/modules/authentication/users/adapters/out/users-types';
import { UpdatePasswordDto } from 'src/modules/authentication/users/adapters/in/dtos/update-password.dto';


//TODO : check name of class
@Injectable()
export class PatientService {
  constructor(private ups: UsersPersistenceService) {}

  //only apply when activate patient
  async activateUserAndPatient({ password, ...rest }: UpdateUser): Promise<User> {
    const salt = bcryptjs.genSaltSync();
    const _user = {
      ...rest,
      password: bcryptjs.hashSync(password, salt),
    };
    const user = await this.ups.updateUser(_user);
    return user;
  }
  async updatePassword({ password, user }: UpdatePasswordDto): Promise<User> {
    //TOD0: create a class to evolve bcryptjs 
    const salt = bcryptjs.genSaltSync();
    const _user = {
      user,
      password: bcryptjs.hashSync(password, salt),
    };

    const userUpdated = await this.ups.updateUser(_user);
    return userUpdated;
  }
}
