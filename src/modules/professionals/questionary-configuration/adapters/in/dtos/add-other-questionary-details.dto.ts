import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsMongoId, IsString, ValidateNested } from 'class-validator';

@InputType()
class CreateOtherQuestionaryDetailInput {
  @Field()
  @IsString()
  fieldName: string;

  @Field()
  @IsString()
  associatedQuestion: string;
}

@InputType()
export class AddOtherQuestionaryDetailsDto {
  @Field()
  @IsMongoId()
  questionary: string;

  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsString()
  questionaryGroup: string;

  @Field(() => [CreateOtherQuestionaryDetailInput])
  @ValidateNested()
  @Type(() => CreateOtherQuestionaryDetailInput)
  questionaryDetailsInput: CreateOtherQuestionaryDetailInput[];
}
