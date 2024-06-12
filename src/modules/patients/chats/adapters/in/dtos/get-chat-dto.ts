import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsOptional } from 'class-validator';

@InputType()
export class GetChatDto {
  @Field({ nullable: true })
  @IsMongoId()
  @IsOptional()
  professional?: string;

  @Field()
  @IsMongoId()
  patient: string;
}
