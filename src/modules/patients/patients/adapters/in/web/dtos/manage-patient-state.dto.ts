import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsMongoId } from 'class-validator';
import { PatientState } from 'src/shared/enums/project';

@InputType()
export class ManagePatientStateDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  patient: string;

  @Field()
  @IsEnum(PatientState)
  state: string;
}
