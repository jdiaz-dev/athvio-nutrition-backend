import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class GetCustomMealDto {
  @Field()
  @IsMongoId()
  customMealId: string;
}
