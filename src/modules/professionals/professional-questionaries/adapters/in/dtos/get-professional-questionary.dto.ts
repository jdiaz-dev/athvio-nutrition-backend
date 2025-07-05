import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class GetProfessionalQuestionaryDto {
  @Field()
  @IsUUID()
  professional: string;
}
