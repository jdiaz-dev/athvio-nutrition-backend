import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsNumber } from 'class-validator';

@InputType()
export class UpdateProgramPlanDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  program: string;

  @Field()
  @IsMongoId()
  plan: string;

  @Field()
  @IsNumber()
  week: number;

  @Field()
  @IsNumber()
  day: number;
}
