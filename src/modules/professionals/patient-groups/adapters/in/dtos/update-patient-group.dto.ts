import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsString } from 'class-validator';

@InputType()
export class UpdatePatientGroupDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsUUID()
  patientGroup: string;

  @Field()
  @IsString()
  groupName: string;
}
