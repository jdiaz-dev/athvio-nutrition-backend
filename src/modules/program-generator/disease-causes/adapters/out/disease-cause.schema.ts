import { ObjectType, Field, ID } from '@nestjs/graphql';

export class Restriction {
  id: string;
  name: string;
}
export class Recomendation {
  id: string;
  name: string;
  details: string;
  restrictions: Restriction[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@ObjectType()
export class DiseaseCause {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  recommendations: Recomendation[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
