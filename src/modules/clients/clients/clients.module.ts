import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsResolver } from 'src/modules/clients/clients/adapters/in/clients.resolver';
import { Client, ClientSchema } from 'src/modules/clients/clients/adapters/out/client.schema';
import { ClientsPersistenceService } from 'src/modules/clients/clients/adapters/out/clients-persistence.service';
import { ClientManagementService } from 'src/modules/clients/clients/application/client-management.service';
import { ManageClientGroupService } from 'src/modules/clients/clients/application/manage-client-group.service';
import { ClientGroupsModule } from 'src/modules/professionals/client-groups/client-groups.module';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { UsersModule } from 'src/modules/authentication/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
    UsersModule,
    forwardRef(() => ClientGroupsModule),
    ProfessionalsModule,
  ],
  providers: [ClientsResolver, ...[ClientsPersistenceService, ManageClientGroupService, ClientManagementService]],
  exports: [ClientsPersistenceService],
})
export class ClientsModule {}
