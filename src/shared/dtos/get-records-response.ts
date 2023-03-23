import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
class Meta {
  @Field()
  total: number;

  @Field()
  limit: number;

  @Field()
  offset: number;
}

@ObjectType()
export class GetRecordsResponse {
  @Field()
  meta: Meta;
}
