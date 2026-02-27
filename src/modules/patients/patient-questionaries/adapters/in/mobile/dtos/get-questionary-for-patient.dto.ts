import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class GetQuestionaryForPatientDto {
  @Field()
  @IsUUID(4)
  patientQuestionary: string;

  @Field()
  @IsUUID(4)
  patient: string;

  @Field()
  @IsUUID(4)
  professional: string;
}
