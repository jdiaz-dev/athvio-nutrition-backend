import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsMongoId, IsNumber, IsOptional } from 'class-validator';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';
import { Meta } from 'src/shared/dtos/get-records-response';
import { FoodDatabases } from 'src/shared/enums/project';
import { Macros } from 'src/shared/models/meal-plan';

@ObjectType()
class FoodProviderSession {
  @Field()
  title: string;

  @Field()
  nextSession: number;
}

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

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  session?: number;
}

@ObjectType()
class FoodsMeta extends Meta {
  @Field(() => FoodProviderSession, { nullable: true })
  foodProviderSessions?: FoodProviderSession;
}

@ObjectType()
export class GetFoodsResponse {
  @Field(() => [Food])
  data: Food[];

  @Field(() => FoodsMeta)
  meta: FoodsMeta;
}
