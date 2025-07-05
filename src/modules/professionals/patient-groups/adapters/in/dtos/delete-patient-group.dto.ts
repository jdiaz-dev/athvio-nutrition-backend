import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeletePatientGroupDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsUUID(4)
  patientGroup: string;
}
