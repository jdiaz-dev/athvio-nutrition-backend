import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateUserDto {
  @Field()
  @IsUUID(4)
  user: string;

  @Field()
  @IsString()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  firstname: string;

  @Field()
  @IsString()
  lastname: string;

  @Field()
  @IsString()
  @IsOptional()
  phone?: string;

  @Field()
  @IsString()
  @IsOptional()
  countryCode?: string;
}
