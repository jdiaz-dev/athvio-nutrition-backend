import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateProgramDto {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;
}

