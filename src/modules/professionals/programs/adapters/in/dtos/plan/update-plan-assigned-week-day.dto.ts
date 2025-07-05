import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsNumber } from 'class-validator';

@InputType()
export class UpdatePlanAssignedWeekDayDto {
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
  week: number;

  @Field()
  @IsNumber()
  day: number;
}
