import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsUUID } from 'class-validator';
import { PatientState } from 'src/shared/enums/project';

@InputType()
export class ManagePatientStateDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsUUID(4)
  patient: string;

  @Field()
  @IsEnum(PatientState)
  state: string;
}
