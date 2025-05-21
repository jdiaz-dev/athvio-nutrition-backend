import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsMongoId, IsString } from 'class-validator';

@InputType()
export class DeleteCustomQuestionaryDetailsDto {
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
  @IsMongoId({ each: true })
  questionaryDetails: string[];
}
