import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsBoolean, IsUUID, IsString, ValidateNested } from 'class-validator';

@InputType()
class EnableQuestionaryDetail {
  @Field()
  @IsUUID()
  questionaryDetail: string;

  @Field()
  @IsBoolean()
  isEnabled: boolean;
}

@InputType()
export class EnableQuestionaryDetailsDto {
  @Field()
  @IsUUID()
  questionary: string;

  @Field()
  @IsUUID()
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
