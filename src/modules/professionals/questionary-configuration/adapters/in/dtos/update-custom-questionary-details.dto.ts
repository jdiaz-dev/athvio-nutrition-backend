import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsBoolean, IsMongoId, IsString, ValidateNested } from 'class-validator';

@InputType()
export class UpdateCustomQuestionaryDetailInput {
  @Field()
  @IsMongoId()
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
export class UpdateCustomQuestionaryDetailsDto {
  @Field()
  @IsMongoId()
  questionary: string;

  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsString()
  questionaryGroup: string;

  @Field(() => [UpdateCustomQuestionaryDetailInput])
  @ValidateNested()
  @Type(() => UpdateCustomQuestionaryDetailInput)
  questionaryDetailsInput: UpdateCustomQuestionaryDetailInput[];
}
