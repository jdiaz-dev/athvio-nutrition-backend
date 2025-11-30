import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanificationResolver } from 'src/modules/patients/planifications/adapters/in/planifications.resolver';
import { PlanificationsPersistenceService } from 'src/modules/patients/planifications/adapters/out/planifications-persistence.service';
import { Planification, PlanificationSchema } from 'src/modules/patients/planifications/adapters/out/planification.schema';
import { PlanificationManagerService } from 'src/modules/patients/planifications/application/planification-manager.service';
import { PatientsModule } from 'src/modules/patients/patients/patients.module';
import { AuthModule } from 'src/modules/auth/auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Planification.name, schema: PlanificationSchema }]), AuthModule, PatientsModule],
  providers: [PlanificationResolver, PlanificationsPersistenceService, PlanificationManagerService],
  exports: [PlanificationManagerService],
})
export class CaloriesModule {}
