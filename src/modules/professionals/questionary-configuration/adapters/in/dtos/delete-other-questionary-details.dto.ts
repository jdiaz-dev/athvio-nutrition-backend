import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsMongoId, IsString } from 'class-validator';

@InputType()
export class DeleteOtherQuestionaryDetailsDto {
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
  @ArrayNotEmpty()
  questionaryDetails: string[];
}
