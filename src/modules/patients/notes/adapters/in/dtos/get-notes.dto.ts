import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { Note } from 'src/modules/patients/notes/adapters/out/note.schema';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';
import { GetRecordsResponse } from 'src/shared/dtos/get-records-response';

@InputType()
export class GetNotesDto extends GetRecordsBaseDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsUUID()
  patient: string;
}

@ObjectType()
export class GetNotesResponse extends GetRecordsResponse {
  @Field(() => [Note])
  data: Note[];
}
