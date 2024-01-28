import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsString } from 'class-validator';

@InputType()
export class CreatePatientGroupDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsString()
  groupName: string;
}
