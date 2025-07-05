import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class GetPatientPlanDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsUUID()
  patient: string;

  @Field()
  @IsUUID()
  patientPlan: string;
}

