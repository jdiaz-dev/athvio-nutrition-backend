import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class DeletePatientPlanCommentDto {
  @IsMongoId()
  @Field()
  patientPlanId: string;

  @IsMongoId()
  @Field()
  patientId: string;

  @IsMongoId()
  @Field()
  commentId: string;
}
