import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsBoolean, IsMongoId, IsString, ValidateNested } from 'class-validator';

@InputType()
export class UpdateQuestionaryDetailInput {
  @Field()
  @IsString()
  fieldName: string;

  @Field()
  @IsString()
  associatedQuestion: string;

  @Field()
  @IsBoolean()
  enabled: boolean;
}

@InputType()
export class UpdateQuestionaryDetailDto {
  @Field()
  @IsMongoId()
  questionary: string;

  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsString()
  questionaryGroup: string;

  @Field()
  @IsString()
  questionaryDetail: string;

  @Field()
  @ValidateNested()
  @Type(() => UpdateQuestionaryDetailInput)
  questionaryDetailInput: UpdateQuestionaryDetailInput;
}
