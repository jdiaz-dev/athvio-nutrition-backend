import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsMongoId } from 'class-validator';

@InputType()
export class UpdatePasswordDto {
  @Field()
  @IsMongoId()
  userId: string;

  @Field()
  @IsString()
  password: string;
}
