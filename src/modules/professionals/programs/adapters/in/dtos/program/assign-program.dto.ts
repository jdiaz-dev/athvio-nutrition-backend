import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsUUID, IsNumber } from 'class-validator';

@InputType()
export class AssignProgramDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsUUID()
  program: string;

  @Field(() => [String])
  @IsUUID({
    each: true
  })
  patients: string[];

  @Field()
  @IsDate()
  assignmentStartDate: Date;

  @Field()
  @IsNumber()
  startingDay: number;

  // notify: boolean
}
