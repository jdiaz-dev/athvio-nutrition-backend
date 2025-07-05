import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsBoolean, IsUUID, IsString, ValidateNested } from 'class-validator';

@InputType()
class CreateCustomQuestionaryDetailInput {
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
export class AddCustomQuestionaryDetailsDto {
  @Field()
  @IsUUID(4)
  questionary: string;

  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsString()
  questionaryGroup: string;

  @Field(() => [CreateCustomQuestionaryDetailInput])
  @ValidateNested()
  @Type(() => CreateCustomQuestionaryDetailInput)
  questionaryDetailsInput: CreateCustomQuestionaryDetailInput[];
}
