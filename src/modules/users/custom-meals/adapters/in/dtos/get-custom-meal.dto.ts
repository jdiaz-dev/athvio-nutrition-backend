import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class GetCustomMealDto {
  @Field()
  @IsString()
  _id: string;
}
