import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class DeleteClientPlanCommentDto {
  @IsMongoId()
  @Field()
  clientPlanId: string;

  @IsMongoId()
  @Field()
  clientId: string;

  @IsMongoId()
  @Field()
  commentId: string;
}
