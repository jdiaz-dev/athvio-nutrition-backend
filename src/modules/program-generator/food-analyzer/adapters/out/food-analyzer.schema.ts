import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
class Mechanism {
  @Field()
  uuid: string;
  @Field()
  englishName: string;
  @Field()
  spanishName: string;
  @Field()
  englishCategory: string;
  @Field()
  spanishCategory: string;
  @Field()
  englishDescription: string;
  @Field()
  spanishDescription: string;
  @Field()
  spanishRelatedDisease: string;
  @Field()
  englishRelatedDisease: string;
  @Field()
  isActive: boolean;
  @Field()
  createdAt: Date;
  @Field()
  updatedAt: Date;
}

@ObjectType()
class Compound {
  @Field()
  uuid: string;
  @Field()
  englishName: string;
  @Field()
  spanishName: string;
  @Field(() => [Mechanism])
  mechanisms: Mechanism[];
  @Field()
  isActive: boolean;
  @Field()
  createdAt: Date;
  @Field()
  updatedAt: Date;
}

@ObjectType()
export class FoodAnalyzer {
  @Field()
  uuid: string;
  @Field()
  englishName: string;
  @Field()
  spanishName: string;
  @Field(() => [Compound])
  compounds: Compound[];
  @Field()
  isActive: boolean;
  @Field()
  createdAt: Date;
  @Field()
  updatedAt: Date;
}
