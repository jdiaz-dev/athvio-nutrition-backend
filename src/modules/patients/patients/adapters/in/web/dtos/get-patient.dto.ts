import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';

@InputType()
export class GetPatientForWebDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsUUID()
  patient: string;
}

@ObjectType()
export class GetPatientForWebResponse extends Patient {}
