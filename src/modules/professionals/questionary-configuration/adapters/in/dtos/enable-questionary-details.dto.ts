import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsBoolean, IsMongoId, IsString, ValidateNested } from 'class-validator';

@InputType()
class EnableQuestionaryDetail {
  @Field()
  @IsMongoId()
  questionaryDetail: string;

  @Field()
  @IsBoolean()
  isEnabled: boolean;
}

@InputType()
export class EnableQuestionaryDetailsDto {
  @Field()
  @IsMongoId()
  questionary: string;

  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsString()
  questionaryGroup: string;

  @Field(() => [EnableQuestionaryDetail])
  @IsArray()
  @ValidateNested()
  @ArrayNotEmpty()
  questionaryDetails: EnableQuestionaryDetail[];
}
