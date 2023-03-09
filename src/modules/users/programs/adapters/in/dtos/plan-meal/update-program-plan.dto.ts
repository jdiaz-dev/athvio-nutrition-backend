import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class UpdateProgramPlanDto {
  @Field()
  @IsString()
  programId: string;

  @Field()
  @IsString()
  planId: string;

  @Field()
  @IsNumber()
  week: number;

  @Field()
  @IsNumber()
  day: number;
}
