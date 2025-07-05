import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class SubscribePublishedMessageDto {
  @Field({ nullable: true })
  @IsUUID()
  professional?: string;

  @Field(() => String)
  @IsUUID()
  patient: string;
}
