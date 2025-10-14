import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignInProfessionalWithGoogleDto {
  @Field()
  idToken: string;
}
