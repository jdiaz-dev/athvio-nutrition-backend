import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { UsersResolver } from 'src/modules/authentication/users/adapters/in/users.resolver';
import { UsersPersistenceService } from 'src/modules/authentication/users/adapters/out/users-persistence.service';
import { User, UserSchema } from 'src/modules/authentication/users/adapters/out/user.schema';
import { AuthenticationModule } from 'src/modules/authentication/authentication/authentication.module';

const services = [UsersPersistenceService];
const resolvers = [UsersResolver];
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthenticationModule),
    forwardRef(() => ProfessionalsModule),
  ],
  providers: [...resolvers, ...services],
  exports: [UsersPersistenceService],
})
export class UsersModule {}
