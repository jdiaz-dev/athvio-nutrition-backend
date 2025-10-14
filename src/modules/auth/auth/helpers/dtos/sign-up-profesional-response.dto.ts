import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignUpProfessionalResponse {
  @Field()
  payment: string;
}
