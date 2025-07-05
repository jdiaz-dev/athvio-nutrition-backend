import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeletePatientPlanCommentDto {
  @IsUUID()
  @Field()
  patientPlanId: string;

  @IsUUID()
  @Field()
  patientId: string;

  @IsUUID()
  @Field()
  commentId: string;
}
