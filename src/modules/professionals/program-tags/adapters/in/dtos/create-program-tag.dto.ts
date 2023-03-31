import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsString } from 'class-validator';

@InputType()
export class CreateProgramTagDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsString()
  title: string;
}
