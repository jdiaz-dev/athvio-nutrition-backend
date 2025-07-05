import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsUUID } from 'class-validator';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';

@InputType()
export class DuplicatePatientPlanDto {
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

  patientPlanToDuplicate?: PatientPlan;
}
