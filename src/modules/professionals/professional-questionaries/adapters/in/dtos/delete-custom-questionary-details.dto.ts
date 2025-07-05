import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsUUID, IsString } from 'class-validator';

@InputType()
export class DeleteCustomQuestionaryDetailsDto {
  @Field()
  @IsUUID(4)
  questionary: string;

  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsString()
  questionaryGroup: string;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(4, { each: true })
  questionaryDetails: string[];
}
