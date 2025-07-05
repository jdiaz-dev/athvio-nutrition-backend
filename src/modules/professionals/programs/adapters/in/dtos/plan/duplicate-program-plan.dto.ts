import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsUUID, IsNumber, Min } from 'class-validator';

@InputType()
export class DuplicateProgramPlanDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsUUID()
  program: string;

  @Field()
  @IsUUID()
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
