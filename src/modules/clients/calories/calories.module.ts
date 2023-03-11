import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaloryResolver } from 'src/modules/clients/calories/adapters/in/calories.resolver';
import { CaloriesPersistenceService } from 'src/modules/clients/calories/adapters/out/calories-persistence.service';
import { Calory, CalorySchema } from 'src/modules/clients/calories/adapters/out/calory.schema';
import { CreateCaloryService } from 'src/modules/clients/calories/application/create-calory-persistence.service';
import { ClientsModule } from 'src/modules/clients/clients/clients.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Calory.name, schema: CalorySchema }]), ClientsModule],
  providers: [CaloryResolver, CaloriesPersistenceService, CreateCaloryService],
})
export class CaloriesModule {}
