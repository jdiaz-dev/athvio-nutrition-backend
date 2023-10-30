import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsDate, IsMongoId, IsNumber } from 'class-validator';

@InputType()
export class AssignProgramDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  program: string;

  @Field()
  @IsMongoId()
  @IsArray()
  clients: string[];

  @Field()
  @IsDate()
  assignmentStartDay: Date;

  @Field()
  @IsNumber()
  startingDay: number;

  // notify: boolean
}
