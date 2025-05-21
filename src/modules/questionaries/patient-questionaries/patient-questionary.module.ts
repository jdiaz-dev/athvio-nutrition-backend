import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'src/modules/auth/auth/auth.module';

import { PatientQuestionaryManager } from 'src/modules/questionaries/patient-questionaries/application/patient-questionary-manager.service';
import { PatientQuestionaryPersistenceService } from 'src/modules/questionaries/patient-questionaries/adapters/out/patient-questionary-persistence.service';
import { PatientQuestionaryResolver } from 'src/modules/questionaries/patient-questionaries/adapters/in/patient-questionary.resolver';
import {
  PatientQuestionary,
  PatientQuestionarySchema,
} from 'src/modules/questionaries/patient-questionaries/adapters/out/patient-questionary.schema';

const resolvers = [PatientQuestionaryResolver];
const services = [PatientQuestionaryManager, PatientQuestionaryPersistenceService];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PatientQuestionary.name, schema: PatientQuestionarySchema }]),
    forwardRef(() => AuthModule),
  ],
  providers: [...resolvers, ...services],
  exports: [PatientQuestionaryManager],
})
export class PatientQuestionaryModule {}
