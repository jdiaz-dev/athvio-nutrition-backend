import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class SignUpPatientFromMobileDto {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}
