import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
class PatientQuestionaryDetailInput {
  @Field()
  @IsMongoId()
  questionaryDetail: string;

  @Field()
  @IsString()
  answer: string;

  @Field()
  @IsString()
  additionalNotes: string;
}

@InputType()
class PatientQuestionaryGroupInput {
  @Field()
  @IsMongoId()
  questionaryGroup: string;

  @Field(() => [PatientQuestionaryDetailInput])
  @ValidateNested()
  @Type(() => PatientQuestionaryDetailInput)
  questionaryDetails: PatientQuestionaryDetailInput[];
}

@InputType()
export class UpdateAnswerAndAdditionalNotesDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsString()
  patient: string;

  @Field()
  @IsMongoId()
  questionary: string;

  @Field(() => [PatientQuestionaryGroupInput])
  @ValidateNested()
  @Type(() => PatientQuestionaryGroupInput)
  questionaryGroups: PatientQuestionaryGroupInput[];
}
