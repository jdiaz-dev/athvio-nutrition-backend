import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class GetPatientQuestionaryByIdDto {
  @Field()
  @IsUUID(4)
  questionary: string;
}
