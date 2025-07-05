import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';

@InputType()
export class GetPatientForWebDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsUUID(4)
  patient: string;
}

@ObjectType()
export class GetPatientForWebResponse extends Patient {}
