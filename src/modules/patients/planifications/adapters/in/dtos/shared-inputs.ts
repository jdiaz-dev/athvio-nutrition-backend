import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class PatientInformationInput {
  @Field()
  @IsNumber()
  weight: number;

  @Field()
  height: number;

  @Field()
  @IsNumber()
  age: number;

  @Field()
  @IsString()
  gender: string;

  @Field()
  @IsString()
  physicActivityName: string;

  @Field()
  @IsNumber()
  physicActivityFactor: number;
}

@InputType()
export class CalculatedMacrosInput {
  @Field()
  @IsNumber()
  protein: number;

  @Field()
  @IsNumber()
  carbs: number;

  @Field()
  @IsNumber()
  fat: number;

  @Field()
  @IsNumber()
  calories: number;
}
