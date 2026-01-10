import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/modules/auth/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { PatientProgram, PatientProgramSchema } from 'src/modules/patients/patient-programs/adapters/out/patient-program.schema';
import { PatientProgramsResolver } from 'src/modules/patients/patient-programs/adapters/in/patient-programs.resolver';
import { PatientProgramsPersistenceService } from 'src/modules/patients/patient-programs/adapters/out/patient-programs-persistence.service';
import { PatientProgramsManagerService } from 'src/modules/patients/patient-programs/application/patient-programs-manager.service';

const resolvers = [PatientProgramsResolver];
const services = [PatientProgramsPersistenceService, PatientProgramsManagerService];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PatientProgram.name, schema: PatientProgramSchema }]),
    forwardRef(() => AuthModule),
    SharedModule,
  ],
  providers: [...resolvers, ...services],
})
export class PatientProgramsModule {}
