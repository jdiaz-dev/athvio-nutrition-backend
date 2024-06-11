import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsOptional, ValidateNested } from 'class-validator';
ValidateNested;
@InputType()
export class SubscribeCommentAddedDto {
  @Field({ nullable: true })
  @IsMongoId()
  @IsOptional()
  professional?: string;

  @Field(() => [String])
  @IsMongoId({ each: true })
  // @ValidateNested({ each: true })
  patients: string[];
}
