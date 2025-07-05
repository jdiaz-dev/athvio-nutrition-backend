import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsString } from 'class-validator';

@InputType()
export class SendPatientQuestionaryDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsString()
  patient: string;

  @Field()
  @IsUUID()
  questionary: string;
}
