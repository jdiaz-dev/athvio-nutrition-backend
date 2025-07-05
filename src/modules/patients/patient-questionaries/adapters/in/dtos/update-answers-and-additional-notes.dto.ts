import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PatientQuestionaryAnswersInput } from 'src/modules/patients/patient-questionaries/adapters/in/dtos/update-answers.dto';

@InputType()
class AnswersAndAdditionalNotesInput extends PatientQuestionaryAnswersInput {
  @Field()
  @IsString()
  additionalNotes: string;
}

@InputType()
class PatientQuestionaryGroupInput {
  @Field()
  @IsUUID(4)
  questionaryGroup: string;

  @Field(() => [AnswersAndAdditionalNotesInput])
  @ValidateNested()
  @Type(() => AnswersAndAdditionalNotesInput)
  questionaryDetails: AnswersAndAdditionalNotesInput[];
}

@InputType()
export class UpdateAnswersAndAdditionalNotesDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsString()
  patient: string;

  @Field()
  @IsUUID(4)
  questionary: string;

  @Field(() => [PatientQuestionaryGroupInput])
  @ValidateNested()
  @Type(() => PatientQuestionaryGroupInput)
  questionaryGroups: PatientQuestionaryGroupInput[];
}
