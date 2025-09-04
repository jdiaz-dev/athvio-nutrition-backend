import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AsyncLocalStorage } from 'node:async_hooks';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { CreateNoteDto } from 'src/modules/patients/notes/adapters/in/dtos/create-note.dto';
import { DeleteNoteDto } from 'src/modules/patients/notes/adapters/in/dtos/delete-note.dto';
import { GetNotesDto, GetNotesResponse } from 'src/modules/patients/notes/adapters/in/dtos/get-notes.dto';
import { UpdateNoteDto } from 'src/modules/patients/notes/adapters/in/dtos/update-note.dto';
import { Note, NoteDocument } from 'src/modules/patients/notes/adapters/out/note.schema';
import { MongodbQueryBuilder } from 'src/shared/database/mongodb-query-builder';

import { InternalErrors } from 'src/shared/enums/messages-response';
import { LayersServer } from 'src/shared/enums/project';
import { Trazability } from 'src/shared/types';

@Injectable()
export class NotesPersistenceService extends MongodbQueryBuilder<NoteDocument> {
  constructor(
    @InjectModel(Note.name) protected readonly noteModel: Model<NoteDocument>,
    protected readonly logger: AthvioLoggerService,
    protected readonly als: AsyncLocalStorage<Trazability>,
  ) {
    super(noteModel, logger, Note.name, als);
  }

  async createNote(dto: CreateNoteDto & { uuid: string }): Promise<Note> {
    try {
      const note = await this.initializeQuery(this.createNote.name).create({
        ...dto,
      });
      return note;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }

  async getNotes(
    { professional, patient, offset, limit }: GetNotesDto,
    selectors: Record<string, number>,
  ): Promise<GetNotesResponse> {
    const notes = await this.initializeQuery(this.getNotes.name).aggregate([
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

    const res: GetNotesResponse = {
      data: notes[0].data,
      meta: {
        total: notes[0].total ? notes[0].total : 0,
        limit: limit,
        offset: offset,
      },
    };
    return res;
  }
  async updateNote({ professional, note, patient, ...rest }: UpdateNoteDto, selectors: Record<string, number>): Promise<Note> {
    const noteRes = await this.initializeQuery(this.updateNote.name).findOneAndUpdate(
      { uuid: note, professional, patient, isDeleted: false },
      { ...rest },
      {
        new: true,
        projection: {
          ...selectors,
        },
      },
    );
    return noteRes;
  }

  async deleteNote({ note, professional, patient }: DeleteNoteDto, selectors: string[]): Promise<Note> {
    const noteRes = await this.initializeQuery(this.deleteNote.name).findOneAndUpdate(
      {
        uuid: note,
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
  }
}
