import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'src/modules/auth/auth/auth.module';

import { PatientQuestionaryManagerService } from 'src/modules/questionaries/patient-questionaries/application/patient-questionary-manager.service';
import { PatientQuestionaryPersistenceService } from 'src/modules/questionaries/patient-questionaries/adapters/out/patient-questionary-persistence.service';
import { PatientQuestionaryResolver } from 'src/modules/questionaries/patient-questionaries/adapters/in/patient-questionary.resolver';
import {
  PatientQuestionary,
  PatientQuestionarySchema,
} from 'src/modules/questionaries/patient-questionaries/adapters/out/patient-questionary.schema';
import { SendPatientQuestionaryService } from 'src/modules/questionaries/patient-questionaries/application/send-patient-questionary.service';
import { PatientsModule } from 'src/modules/patients/patients/patients.module';

const resolvers = [PatientQuestionaryResolver];
const services = [SendPatientQuestionaryService, PatientQuestionaryManagerService, PatientQuestionaryPersistenceService];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PatientQuestionary.name, schema: PatientQuestionarySchema }]),
    forwardRef(() => AuthModule),
    PatientsModule,
  ],
  providers: [...resolvers, ...services],
  exports: [PatientQuestionaryManagerService],
})
export class PatientQuestionaryModule {}
