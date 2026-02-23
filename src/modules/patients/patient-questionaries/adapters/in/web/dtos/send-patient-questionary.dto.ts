import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsString } from 'class-validator';

@InputType()
export class SendPatientQuestionaryDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsString()
  patient: string;

  @Field()
  @IsUUID(4)
  questionary: string;
}
