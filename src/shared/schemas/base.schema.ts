import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseSchema {
  _id!: string;

  @Field()
  createdAt!: Date;

  updatedAt!: Date;
}
