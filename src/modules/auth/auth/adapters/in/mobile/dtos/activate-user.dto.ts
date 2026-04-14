import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsString } from 'class-validator';

@InputType()
export class ActivatePatientDto {
  @Field()
  @IsUUID(4)
  user: string;

  @Field()
  @IsString()
  password: string;
}
