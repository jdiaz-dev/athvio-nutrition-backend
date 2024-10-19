import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientsWebResolver } from 'src/modules/patients/patients/adapters/in/web/patients-web.resolver';
import { Patient, PatientSchema } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { PatientsPersistenceService } from 'src/modules/patients/patients/adapters/out/patients-persistence.service';
import { PatientManagementService } from 'src/modules/patients/patients/application/patient-management.service';
import { ManagePatientGroupService } from 'src/modules/patients/patients/application/manage-patient-group.service';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { PatientGroupsModule } from 'src/modules/professionals/patient-groups/patient-groups.module';
import { AuthenticationModule } from 'src/modules/authentication/authentication/authentication.module';
import { PatientsMobileResolver } from 'src/modules/patients/patients/adapters/in/mobile/patients-mobile.resolver';

const resolvers = [PatientsWebResolver, PatientsMobileResolver];
const services = [PatientsPersistenceService, ManagePatientGroupService, PatientManagementService];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
    forwardRef(() => AuthenticationModule),
    forwardRef(() => PatientGroupsModule),
    forwardRef(() => ProfessionalsModule),
  ],
  providers: [...resolvers, ...services],
  exports: [PatientManagementService],
})
export class PatientsModule {}
