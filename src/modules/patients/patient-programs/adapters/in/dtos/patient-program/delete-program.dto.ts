import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeletePatientProgramDto {
  @Field()
  @IsUUID(4)
  patient: string;

  @Field()
  @IsUUID(4)
  patientProgram: string;
}
