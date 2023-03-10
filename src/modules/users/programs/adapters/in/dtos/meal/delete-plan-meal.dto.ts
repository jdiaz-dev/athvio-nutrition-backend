import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class DeletePlanMealDto {
  @Field()
  @IsMongoId()
  programId: string;

  @Field()
  @IsMongoId()
  planId: string;

  @Field()
  @IsMongoId()
  mealId: string;
}
