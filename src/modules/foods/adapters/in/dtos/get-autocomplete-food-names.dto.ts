import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsMongoId, IsString } from 'class-validator';

@InputType()
export class GetAutocompleteFoodNamesDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsString()
  search: string;
}

@ObjectType()
export class GetAutocompleteFoodNamesResponse {
  @Field(() => [String])
  foodNames: string[];
}
