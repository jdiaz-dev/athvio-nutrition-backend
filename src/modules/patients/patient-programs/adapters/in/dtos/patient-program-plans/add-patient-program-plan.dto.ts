import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';
import { PlanBodyInput } from 'src/shared/adapters/nestjs/dtos/plan-body.input';

@InputType()
export class AddPatientProgramPlanDto {
  @Field()
  @IsUUID(4)
  patient: string;

  @Field()
  @IsUUID(4)
  patientProgram: string;

  @Field()
  @ValidateNested()
  @Type(() => PlanBodyInput)
  planBody: PlanBodyInput;
}
