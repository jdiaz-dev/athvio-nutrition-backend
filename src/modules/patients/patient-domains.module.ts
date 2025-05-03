import { Module } from '@nestjs/common';
import { CaloriesModule } from 'src/modules/patients/calories/calories.module';

import { ChatsModule } from 'src/modules/patients/chats/chats.module';
import { NotesModule } from 'src/modules/patients/notes/notes.module';
import { PatientPlansModule } from 'src/modules/patients/patient-plans/patient-plans.module';
import { PatientsModule } from 'src/modules/patients/patients/patients.module';

@Module({
  imports: [PatientsModule, PatientPlansModule, ChatsModule, CaloriesModule, NotesModule],
  providers: [PatientsModule],
})
export class PatientsDomainsModule {}
