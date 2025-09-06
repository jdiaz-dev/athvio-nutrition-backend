import { ObjectType, Field } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';

@ObjectType()
export class NutritionalPreference extends BaseSchema {
  @Field()
  uuid: string;

  @Field()
  spanishName: string;

  @Field()
  englishName: string;

  spanishDetails: string;
}
