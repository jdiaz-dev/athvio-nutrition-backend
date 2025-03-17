import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaloryResolver } from 'src/modules/patients/calories/adapters/in/calories.resolver';
import { CaloriesPersistenceService } from 'src/modules/patients/calories/adapters/out/calories-persistence.service';
import { Calory, CalorySchema } from 'src/modules/patients/calories/adapters/out/calory.schema';
import { CaloryManagerService } from 'src/modules/patients/calories/application/calory-manager.service';
import { PatientsModule } from 'src/modules/patients/patients/patients.module';
import { AuthenticationModule } from 'src/modules/auth/auth/authentication.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Calory.name, schema: CalorySchema }]),
    AuthenticationModule,
    PatientsModule,
  ],
  providers: [CaloryResolver, CaloriesPersistenceService, CaloryManagerService],
})
export class CaloriesModule {}
