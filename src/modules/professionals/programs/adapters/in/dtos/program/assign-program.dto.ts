import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsMongoId, IsNumber } from 'class-validator';

@InputType()
export class AssignProgramDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  program: string;

  @Field(() => [String])
  @IsMongoId({
    each: true
  })
  clients: string[];

  @Field()
  @IsDate()
  assignmentStartDate: Date;

  @Field()
  @IsNumber()
  startingDay: number;

  // notify: boolean
}
