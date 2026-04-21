import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsNumber, IsString } from 'class-validator';

@InputType()
export class CalculateNutrientsByMeasureDto {
  @Field()
  @IsUUID(4)
  internalFood: string;

  @Field()
  @IsNumber()
  amount: number;

  @Field()
  @IsString()
  uri: string;
}
