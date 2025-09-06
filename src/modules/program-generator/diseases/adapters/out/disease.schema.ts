import { ObjectType, Field } from '@nestjs/graphql';
import { Recommendation } from 'src/modules/program-generator/shared/schemas/recommendation.schema';

@ObjectType()
export class Disease {
  @Field()
  uuid: string;
  @Field(() => String)
  spanishName: string;
  englishName: string;
  recommendations: Recommendation[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
