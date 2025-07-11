import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientsWebResolver } from 'src/modules/patients/patients/adapters/in/web/patients-web.resolver';
import { Patient, PatientSchema } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { PatientsPersistenceService } from 'src/modules/patients/patients/adapters/out/patients-persistence.service';
import { PatientManagerService } from 'src/modules/patients/patients/application/patient-manager.service';
import { ManagePatientGroupService } from 'src/modules/patients/patients/application/manage-patient-group.service';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { PatientGroupsModule } from 'src/modules/professionals/patient-groups/patient-groups.module';
import { AuthModule } from 'src/modules/auth/auth/auth.module';
import { PatientsMobileResolver } from 'src/modules/patients/patients/adapters/in/mobile/patients-mobile.resolver';
import { GetPatientManagerService } from 'src/modules/patients/patients/application/get-patient-manager.service';

const resolvers = [PatientsWebResolver, PatientsMobileResolver];
const services = [PatientsPersistenceService, ManagePatientGroupService, GetPatientManagerService, PatientManagerService];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => PatientGroupsModule),
    forwardRef(() => ProfessionalsModule),
  ],
  providers: [...resolvers, ...services],
  exports: [PatientManagerService, GetPatientManagerService],
})
export class PatientsModule {}
