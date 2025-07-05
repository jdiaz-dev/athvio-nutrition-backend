import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsOptional } from 'class-validator';

@InputType()
export class GetChatDto {
  @Field({ nullable: true })
  @IsUUID(4)
  @IsOptional()
  professional?: string;

  @Field()
  @IsUUID(4)
  patient: string;
}
