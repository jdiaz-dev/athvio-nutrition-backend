import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { UsersResolver } from 'src/modules/security/users/adapters/in/users.resolver';
import { UsersPersistenceService } from 'src/modules/security/users/adapters/out/users-persistence.service';
import { User, UserSchema } from 'src/modules/security/users/adapters/out/user.schema';
import { UserManagementService } from 'src/modules/security/users/application/user-management.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), ProfessionalsModule],
  providers: [UsersResolver, ...[UsersPersistenceService, UserManagementService]],
  exports: [UserManagementService, UsersPersistenceService],
})
export class UsersModule {}
