import { Field, InputType } from '@nestjs/graphql';
// import { Type } from 'class-transformer';
import { IsMongoId, IsOptional, IsArray } from 'class-validator';

@InputType()
export class SubscribeCommentAddedDto {
  @Field({ nullable: true })
  @IsMongoId()
  @IsOptional()
  professional?: string;

  @Field(() => [String])
  @IsArray()
  @IsMongoId({ each: true })
  patients: string[];
}
