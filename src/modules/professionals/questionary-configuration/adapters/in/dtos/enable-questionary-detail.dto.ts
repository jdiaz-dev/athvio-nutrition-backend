import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsMongoId, IsString } from 'class-validator';

@InputType()
export class EnableQuestionaryDetailDto {
  @Field()
  @IsMongoId()
  questionary: string;

  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsString()
  questionaryGroup: string;

  @Field(() => [String])
  @IsArray()
  @IsMongoId({ each: true })
  questionaryDetails: string[];

  @Field()
  @IsBoolean()
  enabled: boolean;
}
