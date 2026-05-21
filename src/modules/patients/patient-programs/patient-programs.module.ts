import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/modules/auth/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { PatientProgram, PatientProgramSchema } from 'src/modules/patients/patient-programs/adapters/out/patient-program.schema';
import { PatientProgramsResolver } from 'src/modules/patients/patient-programs/adapters/in/patient-programs.resolver';
import { PatientProgramsPersistenceService } from 'src/modules/patients/patient-programs/adapters/out/patient-programs-persistence.service';
import { PatientProgramsManagerService } from 'src/modules/patients/patient-programs/application/patient-programs-manager.service';
import { PatientsModule } from 'src/modules/patients/patients/patients.module';
import { PatientProgramPlansPersistenceService } from 'src/modules/patients/patient-programs/adapters/out/patient-program-plans-persistence.service';
import { PatientProgramPlansResolver } from 'src/modules/patients/patient-programs/adapters/in/patient-program-plans.resolver';
import { PatientProgramPlanManagerService } from 'src/modules/patients/patient-programs/application/patient-program-plan-manager.service';

const resolvers = [PatientProgramsResolver, PatientProgramPlansResolver];
const services = [
  PatientProgramsPersistenceService,
  PatientProgramPlanManagerService,
  PatientProgramPlansPersistenceService,
  PatientProgramsManagerService,
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PatientProgram.name, schema: PatientProgramSchema }]),
    forwardRef(() => AuthModule),
    PatientsModule,
    SharedModule,
  ],
  providers: [...resolvers, ...services],
})
export class PatientProgramsModule {}
