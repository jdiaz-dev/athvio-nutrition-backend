import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsBoolean, IsUUID, IsString, ValidateNested } from 'class-validator';

@InputType()
export class UpdateCustomQuestionaryDetailInput {
  @Field()
  @IsUUID(4)
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
  @IsUUID(4)
  questionary: string;

  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsString()
  questionaryGroup: string;

  @Field(() => [UpdateCustomQuestionaryDetailInput])
  @ValidateNested()
  @Type(() => UpdateCustomQuestionaryDetailInput)
  questionaryDetailsInput: UpdateCustomQuestionaryDetailInput[];
}
