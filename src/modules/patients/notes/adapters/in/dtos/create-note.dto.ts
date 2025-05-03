import { Field, InputType } from '@nestjs/graphql';
import {  IsMongoId, IsString } from 'class-validator';

@InputType()
export class CreateNoteDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  patient: string;

  @Field()
  @IsString()
  content: string;
}
