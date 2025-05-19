import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNoteDto } from 'src/modules/patients/notes/adapters/in/dtos/create-note.dto';
import { DeleteNoteDto } from 'src/modules/patients/notes/adapters/in/dtos/delete-note.dto';
import { GetNotesDto, GetNotesResponse } from 'src/modules/patients/notes/adapters/in/dtos/get-notes.dto';
import { UpdateNoteDto } from 'src/modules/patients/notes/adapters/in/dtos/update-note.dto';
import { Note } from 'src/modules/patients/notes/adapters/out/note.schema';
import { NotesPersistenceService } from 'src/modules/patients/notes/adapters/out/notes-persistence.service';

import { ErrorNotesEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class NotesManagerService {
  constructor(private readonly nps: NotesPersistenceService) {}

  async createNote(dto: CreateNoteDto): Promise<Note> {
    return this.nps.createNote(dto);
  }
  async getNotes(dto: GetNotesDto, selectors: Record<string, number>): Promise<GetNotesResponse> {
    return this.nps.getNotes(dto, selectors);
  }
  async updateNote(dto: UpdateNoteDto, selectors: Record<string, number>): Promise<Note> {
    const note = await this.nps.updateNote(dto, selectors);
    if (note == null) throw new BadRequestException(ErrorNotesEnum.NOTE_FOUND);
    return note;
  }
  async deleteNote(dto: DeleteNoteDto, selectors: string[]): Promise<Note> {
    const note = await this.nps.deleteNote(dto, selectors);
    if (note == null) throw new BadRequestException(ErrorNotesEnum.NOTE_FOUND);
    return note;
  }
}
