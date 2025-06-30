import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class PatientQuestionaryAnswersInput {
  @Field()
  @IsMongoId()
  questionaryDetail: string;

  @Field()
  @IsString()
  answer: string;
}

@InputType()
class PatientQuestionaryGroupWithAnswersInput {
  @Field()
  @IsMongoId()
  questionaryGroup: string;

  @Field(() => [PatientQuestionaryAnswersInput])
  @ValidateNested()
  @Type(() => PatientQuestionaryAnswersInput)
  questionaryDetails: PatientQuestionaryAnswersInput[];
}

@InputType()
export class UpdateAnswersDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsString()
  patient: string;

  @Field()
  @IsMongoId()
  questionary: string;

  @Field(() => [PatientQuestionaryGroupWithAnswersInput])
  @ValidateNested()
  @Type(() => PatientQuestionaryGroupWithAnswersInput)
  questionaryGroups: PatientQuestionaryGroupWithAnswersInput[];
}
