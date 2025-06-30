import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class GetProfessionalQuestionaryDto {
  @Field()
  @IsMongoId()
  professional: string;
}
