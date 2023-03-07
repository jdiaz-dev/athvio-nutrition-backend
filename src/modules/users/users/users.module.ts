import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersResolver } from './adapters/in/users.resolver';
import { User, UserSchema } from './adapters/out/user.schema';
import { UsersPersistenceService } from './adapters/out/users-persistence.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersResolver, UsersPersistenceService],
  exports: [UsersPersistenceService],
})
export class UsersModule {}
