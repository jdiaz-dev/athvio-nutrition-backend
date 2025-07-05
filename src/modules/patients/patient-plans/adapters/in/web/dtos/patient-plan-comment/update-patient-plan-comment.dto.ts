import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsString } from 'class-validator';

@InputType()
export class UpdatePatientPlanCommentDto {
  @IsUUID()
  @Field()
  patientPlanId: string;

  @IsUUID()
  @Field()
  patientId: string;

  @IsUUID()
  @Field()
  commentId: string;

  @Field()
  @IsString()
  message: string;
}
