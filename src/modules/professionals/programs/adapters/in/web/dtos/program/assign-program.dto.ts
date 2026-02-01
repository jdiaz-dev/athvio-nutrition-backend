import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsUUID, IsNumber } from 'class-validator';

@InputType()
export class AssignProgramDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsUUID(4)
  program: string;

  @Field(() => [String])
  @IsUUID(4, { each: true })
  patients: string[];

  @Field()
  @IsDate()
  assignmentStartDate: Date;

  @Field()
  @IsNumber()
  startingDay: number;

  // notify: boolean
}
