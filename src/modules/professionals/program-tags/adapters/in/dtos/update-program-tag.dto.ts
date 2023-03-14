import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsString } from 'class-validator';

@InputType()
export class UpdateProgramTagDto {
  @Field()
  @IsMongoId()
  professionalId: string;

  @Field()
  @IsMongoId()
  programTagId: string;

  @Field()
  @IsString()
  title: string;
}
