import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsMongoId } from 'class-validator';

@InputType()
export class ActivateUserDto {
  @Field()
  @IsMongoId()
  user: string;

  @Field()
  @IsString()
  password: string;
}
