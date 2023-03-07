import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class GetCustomMealsDto {
  @Field()
  @IsNumber()
  offset: number;

  @Field()
  @IsNumber()
  size: number;

  @Field()
  @IsString()
  orderBy: string;

  @Field()
  @IsString()
  search: string;
}
