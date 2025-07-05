import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsString } from 'class-validator';

@InputType()
export class UpdatePatientGroupDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsUUID(4)
  patientGroup: string;

  @Field()
  @IsString()
  groupName: string;
}
