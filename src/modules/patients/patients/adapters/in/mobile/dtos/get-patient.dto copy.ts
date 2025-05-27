import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { GetPatientForWebResponse } from 'src/modules/patients/patients/adapters/in/web/dtos/get-patient.dto';

@InputType()
export class GetPatientForMobileDto {
  @Field()
  @IsMongoId()
  patient: string;
}

@ObjectType()
export class GetPatientForMobileResponse extends GetPatientForWebResponse {}
