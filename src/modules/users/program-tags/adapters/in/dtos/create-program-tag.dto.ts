import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateProgramTagDto {
  @Field()
  @IsString()
  title: string;
}
