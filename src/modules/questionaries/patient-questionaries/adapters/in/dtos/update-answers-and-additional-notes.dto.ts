import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PatientQuestionaryAnswersInput } from 'src/modules/questionaries/patient-questionaries/adapters/in/dtos/update-answers.dto';

@InputType()
class AnswersAndAdditionalNotesInput extends PatientQuestionaryAnswersInput {
  @Field()
  @IsString()
  additionalNotes: string;
}

@InputType()
class PatientQuestionaryGroupInput {
  @Field()
  @IsMongoId()
  questionaryGroup: string;

  @Field(() => [AnswersAndAdditionalNotesInput])
  @ValidateNested()
  @Type(() => AnswersAndAdditionalNotesInput)
  questionaryDetails: AnswersAndAdditionalNotesInput[];
}

@InputType()
export class UpdateAnswersAndAdditionalNotesDto {
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
