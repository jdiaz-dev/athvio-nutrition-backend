import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

@InputType()
export class SignUpPatientFromMobileDto {
  @Field()
  @IsString()
  firstname: string;

  @Field()
  @IsString()
  lastname: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsStrongPassword({
    minLength: 3,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 0,
    minSymbols: 0,
  })
  password: string;
}
