import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeletePatientGroupDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsUUID()
  patientGroup: string;
}
