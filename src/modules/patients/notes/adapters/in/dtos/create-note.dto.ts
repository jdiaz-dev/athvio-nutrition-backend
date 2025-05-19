import { Field, InputType } from '@nestjs/graphql';
import { IsDateString, IsMongoId, IsString } from 'class-validator';

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
  
  @Field()
  @IsDateString()
  date: string;
}
