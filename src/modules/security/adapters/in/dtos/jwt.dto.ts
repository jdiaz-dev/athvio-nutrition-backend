import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class JwtDto {
  @Field()
  userId:string

  @Field()
  token:string
}