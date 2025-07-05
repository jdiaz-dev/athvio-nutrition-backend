import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsNumber } from 'class-validator';

@InputType()
export class UpdatePlanAssignedWeekDayDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsUUID(4)
  program: string;

  @Field()
  @IsUUID(4)
  plan: string;

  @Field()
  @IsNumber()
  week: number;

  @Field()
  @IsNumber()
  day: number;
}
