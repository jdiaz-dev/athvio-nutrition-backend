import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientGroupsManagementService } from 'src/modules/professionals/client-groups/application/client-groups-management.service';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { UsersModule } from 'src/modules/security/users/users.module';
import { ClientGroupsResolver } from './adapters/in/client-groups.resolver';
import { ClientGroup, ClientGroupSchema } from './adapters/out/client-group.schema';
import { ClientGroupsPersistenceService } from './adapters/out/client-groups-persistence.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ClientGroup.name, schema: ClientGroupSchema }]),
    UsersModule,
    ProfessionalsModule,
  ],
  providers: [ClientGroupsResolver, ...[ClientGroupsPersistenceService, ClientGroupsManagementService]],
  exports: [ClientGroupsPersistenceService],
})
export class ClientGroupsModule {}
