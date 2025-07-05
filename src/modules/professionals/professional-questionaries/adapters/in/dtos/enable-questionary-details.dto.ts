import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsBoolean, IsUUID, IsString, ValidateNested } from 'class-validator';

@InputType()
class EnableQuestionaryDetail {
  @Field()
  @IsUUID(4)
  questionaryDetail: string;

  @Field()
  @IsBoolean()
  isEnabled: boolean;
}

@InputType()
export class EnableQuestionaryDetailsDto {
  @Field()
  @IsUUID(4)
  questionary: string;

  @Field()
  @IsUUID(4)
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
