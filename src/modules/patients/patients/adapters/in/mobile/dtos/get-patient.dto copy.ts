import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { GetPatientForWebResponse } from 'src/modules/patients/patients/adapters/in/web/dtos/get-patient.dto';

@InputType()
export class GetPatientForMobileDto {
  @Field()
  @IsUUID(4)
  patient: string;
}

@ObjectType()
export class GetPatientForMobileResponse extends GetPatientForWebResponse {}
