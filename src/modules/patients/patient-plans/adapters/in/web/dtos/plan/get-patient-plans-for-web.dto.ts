import { Field, InputType } from '@nestjs/graphql';
import { IsDateString, IsMongoId } from 'class-validator';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';

@InputType()
export class GetPatientPlansForWebDto extends GetRecordsBaseDto {
  @Field()
  @IsMongoId()
  patient: string;

  @Field()
  @IsDateString()
  startDate: string;

  @Field()
  @IsDateString()
  endDate: string;
}
