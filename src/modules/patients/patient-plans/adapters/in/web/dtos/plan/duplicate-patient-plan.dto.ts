import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsUUID } from 'class-validator';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';

@InputType()
export class DuplicatePatientPlanDto {
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

  patientPlanToDuplicate?: PatientPlan;
}
