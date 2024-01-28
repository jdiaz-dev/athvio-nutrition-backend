import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientsResolver } from 'src/modules/patients/patients/adapters/in/patients.resolver';
import { Patient, PatientSchema } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { PatientsPersistenceService } from 'src/modules/patients/patients/adapters/out/patients-persistence.service';
import { PatientManagementService } from 'src/modules/patients/patients/application/patient-management.service';
import { ManagePatientGroupService } from 'src/modules/patients/patients/application/manage-patient-group.service';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { UsersModule } from 'src/modules/authentication/users/users.module';
import { PatientGroupsModule } from 'src/modules/professionals/patient-groups/patient-groups.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
    UsersModule,
    forwardRef(() => PatientGroupsModule),
    ProfessionalsModule,
  ],
  providers: [PatientsResolver, ...[PatientsPersistenceService, ManagePatientGroupService, PatientManagementService]],
  exports: [PatientsPersistenceService],
})
export class PatientsModule {}
