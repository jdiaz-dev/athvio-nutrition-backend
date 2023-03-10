import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsMongoId } from 'class-validator';

@InputType()
export class CreateCaloryDto {
  @Field()
  @IsMongoId()
  clientId!: string;

  @Field()
  @IsNumber()
  protein!: number;

  @Field()
  @IsNumber()
  carbs!: number;

  @Field()
  @IsNumber()
  fat!: number;

  @Field()
  @IsNumber()
  calories!: number;
}
