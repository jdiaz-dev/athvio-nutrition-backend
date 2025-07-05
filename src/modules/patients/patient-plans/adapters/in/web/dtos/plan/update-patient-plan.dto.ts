import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsUUID, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdatePatientPlanDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsUUID(4)
  patient: string;

  @Field()
  @IsUUID(4)
  patientPlan: string;

  @Field()
  @IsDate()
  assignedDate: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title: string;
}
