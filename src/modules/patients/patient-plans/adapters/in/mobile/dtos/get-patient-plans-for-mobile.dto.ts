import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsEnum, IsMongoId } from 'class-validator';
import { PatientPlanTypeDates } from 'src/modules/patients/patient-plans/helpers/enums';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';

@InputType()
export class GetPatientPlansForMobileDto extends GetRecordsBaseDto {
  @Field()
  @IsMongoId()
  patient: string;

  @Field()
  @IsDate()
  currentDate: Date;

  @Field()
  @IsEnum(PatientPlanTypeDates)
  patientPlanTypeDate: PatientPlanTypeDates;
}
