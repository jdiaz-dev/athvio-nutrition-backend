import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsNumber } from 'class-validator';

@InputType()
export class UpdateProgramPlanDto {
  @Field()
  @IsMongoId()
  programId: string;

  @Field()
  @IsMongoId()
  planId: string;

  @Field()
  @IsNumber()
  week: number;

  @Field()
  @IsNumber()
  day: number;
}
