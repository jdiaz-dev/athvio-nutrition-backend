import { Field, InputType } from '@nestjs/graphql';
import { IsDateString, IsUUID } from 'class-validator';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';

@InputType()
export class GetPatientPlansForWebDto extends GetRecordsBaseDto {
  @Field()
  @IsUUID(4)
  patient: string;

  @Field()
  @IsDateString()
  startDate: string;

  @Field()
  @IsDateString()
  endDate: string;
}
