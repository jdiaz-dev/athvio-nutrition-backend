import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { CreateNoteDto } from 'src/modules/patients/notes/adapters/in/dtos/create-note.dto';
import { DeleteNoteDto } from 'src/modules/patients/notes/adapters/in/dtos/delete-note.dto';
import { GetNotesDto, GetNotesResponse } from 'src/modules/patients/notes/adapters/in/dtos/get-notes.dto';
import { UpdateNoteDto } from 'src/modules/patients/notes/adapters/in/dtos/update-note.dto';
import { Note } from 'src/modules/patients/notes/adapters/out/note.schema';
import { NotesManagerService } from 'src/modules/patients/notes/application/notes-manager.service';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractor, selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class NotesResolver {
  constructor(private readonly nms: NotesManagerService) {}

  @Mutation(() => Note)
  async createNote(@Args('input') dto: CreateNoteDto): Promise<Note> {
    return this.nms.createNote(dto);
  }
  @Query(() => GetNotesResponse)
  async getNotes(
    @Args('input') dto: GetNotesDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<GetNotesResponse> {
    return this.nms.getNotes(dto, selectors);
  }
  @Mutation(() => Note)
  async updateNote(
    @Args('input') dto: UpdateNoteDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<Note> {
    const note = await this.nms.updateNote(dto, selectors);
    return note;
  }
  @Mutation(() => Note)
  async deleteNote(@Args('input') dto: DeleteNoteDto, @Info(...selectorExtractor()) selectors: string[]): Promise<Note> {
    const note = await this.nms.deleteNote(dto, selectors);
    return note;
  }
}
