import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsMongoId, IsNumber, Min } from 'class-validator';

@InputType()
export class DuplicateProgramPlanDto {
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
  @IsInt()
  @Min(1)
  week: number;

  @Field()
  @IsNumber()
  @IsInt()
  @Min(1)
  day: number;
}
