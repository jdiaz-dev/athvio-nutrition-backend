import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsMongoId, IsString } from 'class-validator';
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
}

@ObjectType()
export class GetAutocompleteFoodNamesResponse {
  @Field(() => [String])
  foodNames: string[];
}
