import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEnum, IsMongoId, IsString, ValidateNested } from 'class-validator';
import { CommenterType } from 'src/shared/enums/project';

@InputType()
class ChatCommentInput {
  @Field()
  @IsEnum(CommenterType)
  commenter: CommenterType;

  @Field()
  @IsString()
  content: string;
}

@InputType()
export class SaveChatCommentDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  patient: string;

  @Field(() => ChatCommentInput)
  @ValidateNested()
  @Type(() => ChatCommentInput)
  comment: ChatCommentInput;
}
