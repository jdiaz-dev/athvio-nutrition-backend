import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'src/modules/auth/auth/auth.module';

import { PatientQuestionaryManagerService } from 'src/modules/patients/patient-questionaries/application/patient-questionary-manager.service';
import { PatientInternalQuestionaryPersistenceService } from 'src/modules/patients/patient-questionaries/adapters/out/patient-questionary-persistence.service';
import { PatientQuestionaryResolver } from 'src/modules/patients/patient-questionaries/adapters/in/patient-questionary.resolver';
import {
  PatientQuestionary,
  PatientQuestionarySchema,
} from 'src/modules/patients/patient-questionaries/adapters/out/patient-questionary.schema';
import { SendPatientQuestionaryService } from 'src/modules/patients/patient-questionaries/application/send-patient-questionary.service';
import { PatientsModule } from 'src/modules/patients/patients/patients.module';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { MailModule } from 'src/modules/mail/mail.module';

const resolvers = [PatientQuestionaryResolver];
const services = [SendPatientQuestionaryService, PatientQuestionaryManagerService, PatientInternalQuestionaryPersistenceService];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PatientQuestionary.name, schema: PatientQuestionarySchema }]),
    forwardRef(() => AuthModule),
    PatientsModule,
    ProfessionalsModule,
    MailModule,
  ],
  providers: [...resolvers, ...services],
  exports: [PatientQuestionaryManagerService],
})
export class PatientInternalQuestionaryModule {}
