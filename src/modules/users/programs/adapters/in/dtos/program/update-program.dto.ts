import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdateProgramDto {
  @Field()
  @IsString()
  _id: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;
}
