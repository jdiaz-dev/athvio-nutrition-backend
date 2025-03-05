import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Recommendation } from 'src/modules/program-generator/shared/schemas/recommendation.schema';

@ObjectType()
export class DiseaseCause {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  recommendations: Recommendation[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
