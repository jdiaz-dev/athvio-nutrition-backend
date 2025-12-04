import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientsModule } from 'src/modules/patients/patients/patients.module';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { AuthModule } from 'src/modules/auth/auth/auth.module';

import { Note, NoteSchema } from 'src/modules/patients/notes/adapters/out/note.schema';
import { NotesPersistenceService } from 'src/modules/patients/notes/adapters/out/notes-persistence.service';
import { NotesManagerService } from 'src/modules/patients/notes/application/notes-manager.service';
import { NotesResolver } from 'src/modules/patients/notes/adapters/in/notes.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => ProfessionalsModule),
    forwardRef(() => PatientsModule),
  ],
  providers: [NotesPersistenceService, NotesManagerService, NotesResolver],
  exports: [NotesManagerService],
})
export class NotesModule {}
