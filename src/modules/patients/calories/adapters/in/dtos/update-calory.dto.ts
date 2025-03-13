import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsMongoId } from 'class-validator';

@InputType()
export class UpdateCaloryDto {
  @Field()
  @IsMongoId()
  patient!: string;

  @Field()
  @IsMongoId()
  calory!: string;

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
