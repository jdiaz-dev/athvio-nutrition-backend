import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class SubscribePublishedMessageDto {
  @Field({ nullable: true })
  @IsMongoId()
  professional?: string;

  @Field(() => String)
  @IsMongoId()
  patient: string;
}
