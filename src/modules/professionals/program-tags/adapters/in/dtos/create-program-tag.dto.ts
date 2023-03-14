import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsString } from 'class-validator';

@InputType()
export class CreateProgramTagDto {
  @Field()
  @IsMongoId()
  professionalId: string;

  @Field()
  @IsString()
  title: string;
}
