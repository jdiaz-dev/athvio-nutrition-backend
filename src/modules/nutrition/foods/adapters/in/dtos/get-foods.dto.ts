import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsUUID, IsOptional, IsString } from 'class-validator';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';
import { Meta } from 'src/shared/dtos/get-records-response';
import { FoodDatabases, SupportedLanguages } from 'src/shared/enums/project';
import { Macros } from 'src/shared/schemas/macros';
import { IngredientDetail } from 'src/shared/schemas/meal-plan';

@InputType()
export class GetFoodsDto extends GetRecordsBaseDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field(() => String)
  @IsEnum(FoodDatabases)
  foodDatabase: FoodDatabases;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  session?: string;

  @Field(() => String)
  @IsEnum(SupportedLanguages)
  targetLanguage: SupportedLanguages;
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
  @Field(() => String)
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
