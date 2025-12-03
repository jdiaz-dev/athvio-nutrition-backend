import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsUUID } from 'class-validator';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { GetRecordsBaseDto } from 'src/shared/adapters/in/dtos/get-records-base.dto';
import { GetRecordsResponse } from 'src/shared/adapters/in/dtos/get-records-response';
import { PatientState } from 'src/shared/enums/project';

@InputType()
export class GetPatientsDto extends GetRecordsBaseDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field(() => String)
  @IsEnum(PatientState)
  state!: PatientState;
}

@ObjectType()
export class GetPatientsResponse extends GetRecordsResponse {
  @Field(() => [Patient])
  data: Patient[];
}
