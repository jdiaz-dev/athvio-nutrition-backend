import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsMongoId } from 'class-validator';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';
import { GetRecordsResponse } from 'src/shared/dtos/get-records-response';
import { FoodDatabases } from 'src/shared/enums/project';
import { Macros } from 'src/shared/models/meal-plan';

@ObjectType()
export class Measure {
  @Field()
  uri: string;

  @Field()
  label: string;

  @Field()
  weight: number;
}

@ObjectType()
class DefaultMeasure {
  @Field()
  amount: number;

  @Field()
  unit: string;
}

@ObjectType()
export class Food {
  @Field()
  name: string;

  @Field(() => Macros)
  macros: Macros;

  @Field(() => DefaultMeasure)
  defaultMeasure: DefaultMeasure;

  @Field({ nullable: true })
  foodId?: string;

  @Field(() => [Measure], { nullable: true })
  measures?: Measure[];
}

@InputType()
export class GetFoodsDto extends GetRecordsBaseDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsEnum(FoodDatabases)
  foodDatabase: FoodDatabases;
}

@ObjectType()
export class GetFoodsResponse extends GetRecordsResponse {
  @Field(() => [Food])
  data: Food[];
}
