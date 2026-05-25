import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsUUID, IsNumber, Min } from 'class-validator';

@InputType()
export class DuplicatePatientProgramPlanDto {
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
  @IsInt()
  @Min(1)
  week: number;

  @Field()
  @IsNumber()
  @IsInt()
  @Min(1)
  day: number;
}
