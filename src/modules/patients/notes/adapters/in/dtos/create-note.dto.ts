import { Field, InputType } from '@nestjs/graphql';
import { IsDateString, IsUUID, IsString } from 'class-validator';

@InputType()
export class CreateNoteDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsUUID()
  patient: string;

  @Field()
  @IsString()
  content: string;
  
  @Field()
  @IsDateString()
  date: string;
}
