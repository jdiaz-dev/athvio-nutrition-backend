import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsString } from 'class-validator';

@InputType()
export class UpdatePatientPlanCommentDto {
  @IsMongoId()
  @Field()
  patientPlanId: string;

  @IsMongoId()
  @Field()
  patientId: string;

  @IsMongoId()
  @Field()
  commentId: string;

  @Field()
  @IsString()
  message: string;
}
