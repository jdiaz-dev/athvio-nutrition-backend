import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsUUID, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdatePatientPlanDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsUUID()
  patient: string;

  @Field()
  @IsUUID()
  patientPlan: string;

  @Field()
  @IsDate()
  assignedDate: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title: string;
}
