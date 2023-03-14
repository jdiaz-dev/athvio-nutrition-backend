import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsMongoId } from 'class-validator';

@InputType()
export class UpdateCaloryDto {
  @Field()
  @IsMongoId()
  clientId!: string;

  @Field()
  @IsMongoId()
  caloryId!: string;

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
