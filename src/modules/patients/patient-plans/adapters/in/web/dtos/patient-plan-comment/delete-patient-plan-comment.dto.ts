import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeletePatientPlanCommentDto {
  @IsUUID(4)
  @Field()
  patientPlanId: string;

  @IsUUID(4)
  @Field()
  patientId: string;

  @IsUUID(4)
  @Field()
  commentId: string;
}
