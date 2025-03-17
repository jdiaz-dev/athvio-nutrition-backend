import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsString } from 'class-validator';

@InputType()
export class ActivatePatientDto {
  @Field()
  @IsMongoId()
  user: string;

  @Field()
  @IsString()
  password: string;
}
