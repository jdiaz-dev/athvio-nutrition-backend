import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class VerifyPaymentDto {
  @Field()
  @IsUUID(4)
  externalId: string;
}

@ObjectType()
export class VerificationPaymentResponse {
  @Field()
  isSucceded: boolean;
}
