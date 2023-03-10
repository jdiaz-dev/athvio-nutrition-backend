import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientGroupsResolver } from './adapters/in/client-groups.resolver';
import { ClientGroup, ClientGroupSchema } from './adapters/out/client-group.schema';
import { ClientGroupsPersistenceService } from './adapters/out/client-groups-persistence.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: ClientGroup.name, schema: ClientGroupSchema }])],
  providers: [ClientGroupsResolver, ClientGroupsPersistenceService],
  exports: [ClientGroupsPersistenceService],
})
export class ClientGroupsModule {}
