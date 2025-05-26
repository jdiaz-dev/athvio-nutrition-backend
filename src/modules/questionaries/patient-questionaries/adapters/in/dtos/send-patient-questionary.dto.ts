import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsString } from 'class-validator';

@InputType()
export class SendPatientQuestionaryDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsString()
  patient: string;

  @Field()
  @IsMongoId()
  questionary: string;
}
