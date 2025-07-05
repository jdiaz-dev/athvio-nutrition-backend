import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsUUID } from 'class-validator';

@InputType()
export class CreateCaloryDto {
  @Field()
  @IsUUID(4)
  patient!: string;

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
