import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Food } from 'src/modules/foods/adapters/out/food.schema';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';
import { GetRecordsResponse } from 'src/shared/dtos/get-records-response';

@InputType()
export class GetFoodsDto extends GetRecordsBaseDto {}

@ObjectType()
export class GetFoodsResponse extends GetRecordsResponse {
  @Field(() => [Food])
  data: Food[];
}
