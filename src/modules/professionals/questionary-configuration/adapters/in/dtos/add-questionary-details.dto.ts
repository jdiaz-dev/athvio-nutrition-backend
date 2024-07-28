import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsMongoId, IsString, ValidateNested } from 'class-validator';

@InputType()
export class CreateQuestionaryDetailInput {
  @Field()
  @IsString()
  fieldName: string;

  @Field()
  @IsString()
  associatedQuestion: string;
}

@InputType()
export class AddQuestionaryDetailDto {
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
  @ValidateNested()
  @Type(() => CreateQuestionaryDetailInput)
  questionaryDetailInput: CreateQuestionaryDetailInput;
}
