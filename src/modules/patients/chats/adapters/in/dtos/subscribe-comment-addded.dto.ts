import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class SubscribePublishedMessageDto {
  @Field({ nullable: true })
  @IsUUID(4)
  professional?: string;

  @Field(() => String)
  @IsUUID(4)
  patient: string;
}
