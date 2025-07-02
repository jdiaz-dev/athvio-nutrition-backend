import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { UsersWebResolver } from 'src/modules/auth/users/adapters/in/web/users-web.resolver';
import { UsersPersistenceService } from 'src/modules/auth/users/adapters/out/users-persistence.service';
import { User, UserSchema } from 'src/modules/auth/users/adapters/out/user.schema';
import { AuthModule } from 'src/modules/auth/auth/auth.module';
import { UserManagamentService } from 'src/modules/auth/users/application/user-management.service';
import { PatientsModule } from 'src/modules/patients/patients/patients.module';
import { UsersMobileResolver } from 'src/modules/auth/users/adapters/in/mobile/users-mobile.resolver';
import { CreateUserService } from 'src/modules/auth/users/application/create-user.service';

const services = [UsersPersistenceService, UserManagamentService, CreateUserService];
const resolvers = [UsersMobileResolver, UsersWebResolver];
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => PatientsModule),
    forwardRef(() => ProfessionalsModule),
    forwardRef(() => AuthModule),
  ],
  providers: [...resolvers, ...services],
  exports: [UsersPersistenceService, CreateUserService, UserManagamentService],
})
export class UsersModule {}
