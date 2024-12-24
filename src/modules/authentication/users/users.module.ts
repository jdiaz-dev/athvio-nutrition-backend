import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { UsersWebResolver } from 'src/modules/authentication/users/adapters/in/web/users-web.resolver';
import { UsersPersistenceService } from 'src/modules/authentication/users/adapters/out/users-persistence.service';
import { User, UserSchema } from 'src/modules/authentication/users/adapters/out/user.schema';
import { AuthenticationModule } from 'src/modules/authentication/authentication/authentication.module';
import { UserManagamentService } from 'src/modules/authentication/users/application/user-management.service';
import { PatientsModule } from 'src/modules/patients/patients/patients.module';
import { UsersMobileResolver } from 'src/modules/authentication/users/adapters/in/mobile/users-mobile.resolver';

const services = [UsersPersistenceService, UserManagamentService];
const resolvers = [UsersMobileResolver, UsersWebResolver];
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthenticationModule),
    forwardRef(() => ProfessionalsModule),
    PatientsModule,
  ],
  providers: [...resolvers, ...services],
  exports: [UsersPersistenceService],
})
export class UsersModule {}
