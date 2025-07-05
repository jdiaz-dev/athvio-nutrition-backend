import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsUUID } from 'class-validator';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';
import { GetRecordsResponse } from 'src/shared/dtos/get-records-response';
import { PatientState } from 'src/shared/enums/project';

@InputType()
export class GetPatientsDto extends GetRecordsBaseDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsEnum(PatientState)
  state!: PatientState;
}

@ObjectType()
export class GetPatientsResponse extends GetRecordsResponse {
  @Field(() => [Patient])
  data: Patient[];
}
