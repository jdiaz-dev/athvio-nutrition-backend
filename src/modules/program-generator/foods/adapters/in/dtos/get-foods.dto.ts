import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { LanguagesEnum } from 'src/modules/program-generator/foods/helpers/constants';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';
import { Meta } from 'src/shared/dtos/get-records-response';
import { FoodDatabases } from 'src/shared/enums/project';
import { Macros } from 'src/shared/models/macros';
import { IngredientDetail } from 'src/shared/models/meal-plan';

@InputType()
export class GetFoodsDto extends GetRecordsBaseDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsEnum(FoodDatabases)
  foodDatabase: FoodDatabases;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  session?: string;

  @Field()
  @IsEnum(LanguagesEnum)
  targetLanguage: LanguagesEnum;
}

@ObjectType()
class FoodProviderSession {
  @Field()
  title: string;

  @Field()
  nextSession: string;
}

@ObjectType()
export class Measure {
  @Field({ nullable: true })
  uri?: string;

  @Field()
  label: string;

  @Field()
  weightInGrams: number;
}

@ObjectType()
export class Food {
  @Field()
  foodDatabase: FoodDatabases;

  @Field()
  name: string;

  @Field(() => Macros)
  macros: Macros;

  @Field(() => [IngredientDetail], { nullable: true })
  ingredientDetails?: IngredientDetail[];

  @Field({ nullable: true })
  foodId?: string;

  @Field(() => [Measure])
  availableMeasures: Measure[];
}

@ObjectType()
export class FoodsMeta extends Meta {
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
