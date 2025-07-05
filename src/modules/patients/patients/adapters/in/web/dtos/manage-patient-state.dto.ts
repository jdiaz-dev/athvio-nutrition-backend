import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsUUID } from 'class-validator';
import { PatientState } from 'src/shared/enums/project';

@InputType()
export class ManagePatientStateDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsUUID()
  patient: string;

  @Field()
  @IsEnum(PatientState)
  state: string;
}
