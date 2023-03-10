import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsString } from 'class-validator';

@InputType()
export class UpdateClientPlanCommentDto {
  @IsMongoId()
  @Field()
  clientPlanId: string;

  @IsMongoId()
  @Field()
  clientId: string;

  @IsMongoId()
  @Field()
  commentId: string;

  @Field()
  @IsString()
  message: string;
}
