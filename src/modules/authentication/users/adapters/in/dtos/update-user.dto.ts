import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsMongoId } from 'class-validator';

@InputType()
export class UpdateUserDto {
  @Field()
  @IsMongoId()
  user: string;

  @Field()
  @IsString()
  email: string;

  @Field()
  @IsString()
  firstName: string;

  @Field()
  @IsString()
  lastName: string;
}
