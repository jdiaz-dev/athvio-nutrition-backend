import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaloryResolver } from 'src/modules/clients/calories/adapters/in/clients.resolver';
import { CaloriesPersistenceService } from 'src/modules/clients/calories/adapters/out/calories-persistence.service';
import { Calory, CalorySchema } from 'src/modules/clients/calories/adapters/out/calory.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Calory.name, schema: CalorySchema }])],
  providers: [CaloryResolver, CaloriesPersistenceService],
})
export class CaloriesModule {}

