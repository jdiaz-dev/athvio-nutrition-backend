import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientsModule } from 'src/modules/patients/patients/patients.module';
import { PatientGroupsManagementService } from 'src/modules/professionals/patient-groups/application/patient-groups-management.service';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { UsersModule } from 'src/modules/authentication/users/users.module';
import { PatientGroupsResolver } from './adapters/in/patient-groups.resolver';
import { PatientGroup, PatientGroupSchema } from './adapters/out/patient-group.schema';
import { PatientGroupsPersistenceService } from './adapters/out/patient-groups-persistence.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PatientGroup.name, schema: PatientGroupSchema }]),
    UsersModule,
    forwardRef(() => PatientsModule),
    ProfessionalsModule,
  ],
  providers: [PatientGroupsResolver, ...[PatientGroupsPersistenceService, PatientGroupsManagementService]],
  exports: [PatientGroupsPersistenceService],
})
export class PatientGroupsModule {}
