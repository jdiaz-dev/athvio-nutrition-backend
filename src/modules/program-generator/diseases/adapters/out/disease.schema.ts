import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Disease {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
