import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsNumber } from 'class-validator';

@InputType()
export class UpdatePatientProgramPlanWeekDayDto {
  @Field()
  @IsUUID(4)
  patient: string;

  @Field()
  @IsUUID(4)
  patientProgram: string;

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
