import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class DeleteProgramTagDto {
  @Field()
  @IsString()
  _id: string;
}
