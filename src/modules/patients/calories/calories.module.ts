import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaloryResolver } from 'src/modules/patients/calories/adapters/in/calories.resolver';
import { CaloriesPersistenceService } from 'src/modules/patients/calories/adapters/out/calories-persistence.service';
import { Calory, CalorySchema } from 'src/modules/patients/calories/adapters/out/calory.schema';
import { CreateCaloryService } from 'src/modules/patients/calories/application/create-calory-persistence.service';
import { PatientsModule } from 'src/modules/patients/patients/patients.module';
import { AuthenticationModule } from 'src/modules/authentication/authentication/authentication.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Calory.name, schema: CalorySchema }]),
    AuthenticationModule,
    PatientsModule,
  ],
  providers: [CaloryResolver, CaloriesPersistenceService, CreateCaloryService],
})
export class CaloriesModule {}
