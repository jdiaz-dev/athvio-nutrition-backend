import { Field, InputType } from '@nestjs/graphql';
import { IsDateString, IsUUID, IsString } from 'class-validator';

@InputType()
export class CreateNoteDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsUUID(4)
  patient: string;

  @Field()
  @IsString()
  content: string;
  
  @Field()
  @IsDateString()
  date: string;
}
