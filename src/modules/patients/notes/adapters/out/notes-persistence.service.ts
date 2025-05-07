import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { CreateNoteDto } from 'src/modules/patients/notes/adapters/in/dtos/create-note.dto';
import { DeleteNoteDto } from 'src/modules/patients/notes/adapters/in/dtos/delete-note.dto';
import { GetNotesDto } from 'src/modules/patients/notes/adapters/in/dtos/get-notes.dto';
import { UpdateNoteDto } from 'src/modules/patients/notes/adapters/in/dtos/update-note.dto';
import { Note, NoteDocument } from 'src/modules/patients/notes/adapters/out/note.schema';

import { InternalErrors } from 'src/shared/enums/messages-response';
import { LayersServer } from 'src/shared/enums/project';

@Injectable()
export class NotesPersistenceService {
  constructor(
    @InjectModel(Note.name) private readonly noteModel: Model<NoteDocument>,
    private readonly logger: AthvioLoggerService,
  ) {}

  async createNote(dto: CreateNoteDto): Promise<Note> {
    try {
      const note = await this.noteModel.create({
        ...dto,
      });
      return note;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }

  async getNotes({ professional, patient, offset, limit }: GetNotesDto, selectors: Record<string, number>): Promise<Note[]> {
    try {
      const notes = await this.noteModel.aggregate([
        {
          $match: {
            professional: professional,
            patient: patient,
            isDeleted: false,
          },
        },
        {
          $project: {
            ...selectors,
          },
        },
        {
          $sort: { createdAt: 1 },
        },
        {
          $facet: {
            data: [
              {
                $skip: offset,
              },
              {
                $limit: limit,
              },
              {
                $project: selectors,
              },
            ],
            meta: [{ $count: 'total' }],
          },
        },
        {
          $project: {
            data: 1,
            total: { $arrayElemAt: ['$meta.total', 0] },
          },
        },
      ]);

      return notes[0].data;
    } catch (error: unknown) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error, message: (error as Error).message });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async updateNote({ professional, note, patient, ...rest }: UpdateNoteDto, selectors: Record<string, number>): Promise<Note> {
    try {
      const noteRes = await this.noteModel.findOneAndUpdate(
        { _id: note, professional, patient, isDeleted: false },
        { ...rest },
        {
          new: true,
          projection: {
            ...selectors,
          },
        },
      );
      return noteRes;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }

  async deleteNote({ note, professional, patient }: DeleteNoteDto, selectors: string[]): Promise<Note> {
    try {
      const noteRes = await this.noteModel.findOneAndUpdate(
        {
          _id: note,
          professional,
          patient,
          isDeleted: false,
        },
        {
          isDeleted: true,
        },
        {
          new: true,
          projection: selectors,
        },
      );

      return noteRes;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
}
