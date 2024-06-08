import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class ActivatePatientDto {
  @Field()
  @IsMongoId()
  user: string;
}
