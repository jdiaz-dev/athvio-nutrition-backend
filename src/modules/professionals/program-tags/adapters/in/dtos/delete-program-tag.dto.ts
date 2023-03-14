import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class DeleteProgramTagDto {
  @Field()
  @IsMongoId()
  professionalId: string;

  @Field()
  @IsMongoId()
  programTagId: string;
}
