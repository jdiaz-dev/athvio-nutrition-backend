import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  MaxLength,
} from 'class-validator';
import { CommenterType } from 'src/shared/enums/project';

function IsValidCommenter(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ValidateRightCommenter',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(comment: ChatCommentInput, args: ValidationArguments) {
          const professional = (args.object as SaveChatCommentDto).professional;
          const validCommenterRelationship = () =>
            (professional && comment.commenter === CommenterType.PATIENT) ||
            (!professional && comment.commenter === CommenterType.PROFESSIONAL);
          return !validCommenterRelationship();
        },
      },
    });
  };
}

@InputType()
class ChatCommentInput {
  @Field()
  @IsEnum(CommenterType)
  commenter: CommenterType;

  @Field()
  @IsString()
  @MaxLength(300)
  content: string;
}

@InputType()
export class SaveChatCommentDto {
  @Field({ nullable: true })
  @IsMongoId()
  @IsOptional()
  professional?: string;

  @Field()
  @IsMongoId()
  patient: string;

  @Field(() => ChatCommentInput)
  @ValidateNested()
  @IsValidCommenter('comment', {
    message: 'This relationship comment is not allowed',
  })
  @Type(() => ChatCommentInput)
  comment: ChatCommentInput;
}
