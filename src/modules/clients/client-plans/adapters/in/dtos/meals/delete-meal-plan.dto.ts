import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class DeletePlanMealDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  client: string;

  @Field()
  @IsMongoId()
  clientPlan: string;

  @Field()
  @IsMongoId()
  meal: string;
}
