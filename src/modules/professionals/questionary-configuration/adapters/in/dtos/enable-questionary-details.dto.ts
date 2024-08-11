import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsMongoId, IsString, ValidateNested } from 'class-validator';

@InputType()
class EnableQuestionaryDetail {
  @Field()
  @IsMongoId()
  questionaryDetail: string;

  @Field()
  @IsBoolean()
  enabled: boolean;
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
  questionaryDetails: EnableQuestionaryDetail[];
}
