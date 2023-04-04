import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { CustomRecipe } from 'src/modules/professionals/custom-recipes/adapters/out/custom-recipe.schema';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';
import { GetRecordsResponse } from 'src/shared/dtos/get-records-response';

@InputType()
export class GetCustomRecipesDto extends GetRecordsBaseDto {
  @Field()
  @IsMongoId()
  professional: string;
}

@ObjectType()
export class GetCustomRecipesResponse extends GetRecordsResponse {
  @Field(() => [CustomRecipe])
  data: CustomRecipe[];
}
