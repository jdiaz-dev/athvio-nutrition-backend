import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsOptional } from 'class-validator';

@InputType()
export class GetChatDto {
  @Field({ nullable: true })
  @IsUUID()
  @IsOptional()
  professional?: string;

  @Field()
  @IsUUID()
  patient: string;
}
