import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsBoolean, IsMongoId, IsString, ValidateNested } from 'class-validator';

@InputType()
export class UpdateOtherQuestionaryDetailInput {
  @Field()
  @IsString()
  questionaryDetail: string;

  @Field()
  @IsString()
  fieldName: string;

  @Field()
  @IsString()
  associatedQuestion: string;

  @Field()
  @IsBoolean()
  isEnabled: boolean;
}

@InputType()
export class UpdateOtherQuestionaryDetailsDto {
  @Field()
  @IsMongoId()
  questionary: string;

  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsString()
  questionaryGroup: string;

  @Field(() => [UpdateOtherQuestionaryDetailInput])
  @ValidateNested()
  @Type(() => UpdateOtherQuestionaryDetailInput)
  questionaryDetailsInput: UpdateOtherQuestionaryDetailInput[];
}
