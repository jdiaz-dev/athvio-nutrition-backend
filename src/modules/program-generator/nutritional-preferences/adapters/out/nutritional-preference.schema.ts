import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';

@ObjectType()
export class NutritionalPreference extends BaseSchema {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;
}
