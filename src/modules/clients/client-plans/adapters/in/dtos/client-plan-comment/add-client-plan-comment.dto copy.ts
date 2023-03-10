import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEnum, IsMongoId, IsString, ValidateNested } from 'class-validator';
import { CommenterType } from 'src/shared/enums/project';

@InputType()
export class CommenterInput {
  @Field()
  @IsMongoId()
  commenterId!: string;

  @Field()
  @IsEnum(CommenterType)
  type!: CommenterType;
}

@InputType()
export class AddClientPlanCommentDto {
  @IsMongoId()
  @Field()
  clientPlanId: string;

  @IsMongoId()
  @Field()
  clientId: string;

  @Field()
  @IsString()
  message: string;

  @Field(() => CommenterInput)
  @ValidateNested()
  @Type(() => CommenterInput)
  commenter: CommenterInput;
}
