import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { PatientProgram } from 'src/modules/patients/patient-programs/adapters/out/patient-program.schema';
import { GetRecordsBaseDto } from 'src/shared/adapters/in/dtos/get-records-base.dto';
import { GetRecordsResponse } from 'src/shared/adapters/in/dtos/get-records-response';

@InputType()
export class GetPatientProgramsDto extends GetRecordsBaseDto {
  @Field()
  @IsUUID(4)
  patient: string;
}

@ObjectType()
export class GetPatientProgramsResponse extends GetRecordsResponse {
  @Field(() => [PatientProgram])
  data: PatientProgram[];
}
