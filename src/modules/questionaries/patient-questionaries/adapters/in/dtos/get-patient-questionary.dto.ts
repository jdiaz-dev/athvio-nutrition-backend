import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class GetPatientQuestionaryDto {
  @Field()
  @IsMongoId()
  patient: string;

  @Field()
  @IsMongoId()
  professional: string;
}
