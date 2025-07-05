import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsString } from 'class-validator';

@InputType()
export class CreatePatientGroupDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsString()
  groupName: string;
}
