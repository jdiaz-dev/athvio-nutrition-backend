import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsUUID, IsString } from 'class-validator';
import { FoodDatabases, SupportedLanguages } from 'src/shared/enums/project';

@InputType()
export class GetAutocompleteFoodNamesDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsString()
  search: string;

  @Field(() => String)
  @IsEnum(FoodDatabases)
  foodDatabase: FoodDatabases;

  @Field(() => String)
  @IsEnum(SupportedLanguages)
  targetLanguage: SupportedLanguages;
}

@ObjectType()
export class GetAutocompleteFoodNamesResponse {
  @Field(() => [String])
  foodNames: string[];
}
