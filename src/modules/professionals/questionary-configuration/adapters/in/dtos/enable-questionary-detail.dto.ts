import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsMongoId, IsString } from 'class-validator';

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

  @Field()
  @IsString()
  questionaryDetail: string;

  @Field()
  @IsBoolean()
  enabled: boolean;
}
