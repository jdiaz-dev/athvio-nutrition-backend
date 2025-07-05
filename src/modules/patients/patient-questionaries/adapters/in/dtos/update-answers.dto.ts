import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class PatientQuestionaryAnswersInput {
  @Field()
  @IsUUID()
  questionaryDetail: string;

  @Field()
  @IsString()
  answer: string;
}

@InputType()
class PatientQuestionaryGroupWithAnswersInput {
  @Field()
  @IsUUID()
  questionaryGroup: string;

  @Field(() => [PatientQuestionaryAnswersInput])
  @ValidateNested()
  @Type(() => PatientQuestionaryAnswersInput)
  questionaryDetails: PatientQuestionaryAnswersInput[];
}

@InputType()
export class UpdateAnswersDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsString()
  patient: string;

  @Field()
  @IsUUID()
  questionary: string;

  @Field(() => [PatientQuestionaryGroupWithAnswersInput])
  @ValidateNested()
  @Type(() => PatientQuestionaryGroupWithAnswersInput)
  questionaryGroups: PatientQuestionaryGroupWithAnswersInput[];
}
