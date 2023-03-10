import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsResolver } from 'src/modules/clients/clients/adapters/in/clients.resolver';
import { Client, ClientSchema } from 'src/modules/clients/clients/adapters/out/client.schema';
import { ClientsPersistenceService } from 'src/modules/clients/clients/adapters/out/clients-persistence.service';
import { ManageClientGroupService } from 'src/modules/clients/clients/application/manage-client-group.service';
import { ClientGroupsModule } from 'src/modules/users/client-groups/client-groups.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]), ClientGroupsModule],
  providers: [ClientsResolver, ClientsPersistenceService, ManageClientGroupService],
})
export class ClientsModule {}
