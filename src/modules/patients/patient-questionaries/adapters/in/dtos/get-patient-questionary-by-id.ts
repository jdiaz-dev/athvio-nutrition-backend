import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class GetPatientQuestionaryByIdDto {
  @Field()
  @IsMongoId()
  questionary: string;
}
