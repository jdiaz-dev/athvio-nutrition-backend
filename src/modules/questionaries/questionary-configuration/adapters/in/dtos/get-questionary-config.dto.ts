import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class GetQuestionaryConfigDto {
  @Field()
  @IsMongoId()
  professional: string;
}
