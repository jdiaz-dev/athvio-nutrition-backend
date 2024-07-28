import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsString } from 'class-validator';

@InputType()
export class DeleteQuestionaryDetailDto {
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
}
