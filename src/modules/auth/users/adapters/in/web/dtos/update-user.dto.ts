import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateUserDto {
  @Field()
  @IsUUID()
  user: string;

  @Field()
  @IsString()
  email: string;

  @Field()
  @IsString()
  firstname: string;

  @Field()
  @IsString()
  lastname: string;
}
