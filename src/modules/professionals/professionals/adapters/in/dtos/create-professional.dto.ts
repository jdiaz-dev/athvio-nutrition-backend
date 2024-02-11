import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProfessionalDto {
  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
