import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';

@InputType()
export class GetPatientForWebDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  patient: string;
}

@ObjectType()
export class GetPatientForWebResponse extends Patient {}
