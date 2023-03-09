import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class AddProgramTagDto {
  @Field()
  @IsString()
  _id: string;

  @Field()
  @IsString()
  programTagId: string;

  @Field()
  @IsString()
  action: string;
}
