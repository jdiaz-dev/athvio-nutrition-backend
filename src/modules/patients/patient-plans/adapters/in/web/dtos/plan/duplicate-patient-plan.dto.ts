import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsMongoId } from 'class-validator';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';

@InputType()
export class DuplicatePatientPlanDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  patient: string;

  @Field()
  @IsMongoId()
  patientPlan: string;

  @Field()
  @IsDate()
  assignedDate: Date;

  patientPlanToDuplicate?: PatientPlan;
}
