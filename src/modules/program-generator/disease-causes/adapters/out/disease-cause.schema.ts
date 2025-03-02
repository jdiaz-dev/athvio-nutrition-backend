import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class DiseaseCause {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
