import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsMongoId, IsString } from 'class-validator';
import { LanguagesEnum } from 'src/modules/program-generator/foods/helpers/constants';
import { FoodDatabases } from 'src/shared/enums/project';

@InputType()
export class GetAutocompleteFoodNamesDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsString()
  search: string;

  @Field()
  @IsEnum(FoodDatabases)
  foodDatabase: FoodDatabases;

  @Field()
  @IsEnum(LanguagesEnum)
  targetLanguage: LanguagesEnum;
}

@ObjectType()
export class GetAutocompleteFoodNamesResponse {
  @Field(() => [String])
  foodNames: string[];
}
