import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsUUID, IsString } from 'class-validator';

@InputType()
export class DeleteCustomQuestionaryDetailsDto {
  @Field()
  @IsUUID()
  questionary: string;

  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsString()
  questionaryGroup: string;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID({ each: true })
  questionaryDetails: string[];
}
