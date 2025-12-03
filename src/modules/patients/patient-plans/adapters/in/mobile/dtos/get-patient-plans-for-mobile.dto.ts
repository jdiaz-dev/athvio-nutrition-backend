import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsEnum, IsUUID } from 'class-validator';
import { PatientPlanTypeDates } from 'src/modules/patients/patient-plans/helpers/enums';
import { GetRecordsBaseDto } from 'src/shared/adapters/in/dtos/get-records-base.dto';

@InputType()
export class GetPatientPlansForMobileDto extends GetRecordsBaseDto {
  @Field()
  @IsUUID(4)
  patient: string;

  @Field()
  @IsDate()
  currentDate: Date;

  @Field(() => String)
  @IsEnum(PatientPlanTypeDates)
  patientPlanTypeDate: PatientPlanTypeDates;
}
