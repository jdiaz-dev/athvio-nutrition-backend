import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsUUID } from 'class-validator';

@InputType()
export class UpdateCaloryDto {
  @Field()
  @IsUUID(4)
  patient!: string;

  @Field()
  @IsUUID(4)
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
