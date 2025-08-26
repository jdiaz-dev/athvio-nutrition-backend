import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, ValidateNested } from 'class-validator';
import {
  CalculatedMacrosInput,
  PatientInformationInput,
} from 'src/modules/patients/planifications/adapters/in/dtos/shared-inputs';

@InputType()
export class UpdatePlanificationDto {
  @Field()
  @IsUUID(4)
  patient!: string;

  @Field()
  @IsUUID(4)
  planification!: string;

  @Field(() => PatientInformationInput)
  @ValidateNested()
  patientInformation: PatientInformationInput;

  @Field(() => CalculatedMacrosInput)
  @ValidateNested()
  configuredMacros!: CalculatedMacrosInput;
}
