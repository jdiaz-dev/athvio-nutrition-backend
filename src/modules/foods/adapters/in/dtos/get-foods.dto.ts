import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';
import { GetRecordsResponse } from 'src/shared/dtos/get-records-response';
import { Macros } from 'src/shared/models/meal-plan';

@ObjectType()
class Measure {
  @Field()
  uri: string;

  @Field()
  label: string;

  @Field()
  weight: number;
}

@ObjectType()
export class Food {
  @Field()
  name: string;

  @Field(() => Macros)
  macros: Macros;

  @Field()
  defaultMeasure: string;

  @Field({ nullable: true })
  foodId?: string;

  @Field(() => [Measure], { nullable: true })
  measures?: Measure[];
}

@InputType()
export class GetFoodsDto extends GetRecordsBaseDto {}

@ObjectType()
export class GetFoodsResponse extends GetRecordsResponse {
  @Field(() => [Food])
  data: Food[];
}
