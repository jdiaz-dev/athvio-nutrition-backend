import { Module } from '@nestjs/common';
import { PlanificationModule } from 'src/modules/patients/planifications/planifications.module';

import { ChatsModule } from 'src/modules/patients/chats/chats.module';
import { NotesModule } from 'src/modules/patients/notes/notes.module';
import { PatientPlansModule } from 'src/modules/patients/patient-plans/patient-plans.module';
import { PatientQuestionaryModule } from 'src/modules/patients/patient-questionaries/patient-questionary.module';
import { PatientsModule } from 'src/modules/patients/patients/patients.module';
import { PatientProgramsModule } from 'src/modules/patients/patient-programs/patient-programs.module';

@Module({
  imports: [
    PatientsModule,
    PatientProgramsModule,
    PatientPlansModule,
    PatientQuestionaryModule,
    ChatsModule,
    PlanificationModule,
    NotesModule,
  ],
  providers: [PatientsModule],
})
export class PatientsSubDomainsModule {}
