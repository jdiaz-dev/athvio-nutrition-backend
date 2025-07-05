import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsString } from 'class-validator';

@InputType()
export class UpdatePatientPlanCommentDto {
  @IsUUID(4)
  @Field()
  patientPlanId: string;

  @IsUUID(4)
  @Field()
  patientId: string;

  @IsUUID(4)
  @Field()
  commentId: string;

  @Field()
  @IsString()
  message: string;
}
