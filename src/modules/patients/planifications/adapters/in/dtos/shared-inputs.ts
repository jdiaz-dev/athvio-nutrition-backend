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
  proteinInPercentage: number;

  @Field()
  @IsNumber()
  carbsInPercentage: number;

  @Field()
  @IsNumber()
  fatInPercentage: number;

  @Field()
  @IsNumber()
  totalProtein: number;

  @Field()
  @IsNumber()
  totalCarbs: number;

  @Field()
  @IsNumber()
  totalFat: number;

  @Field()
  @IsNumber()
  basalEnergyRate: number;

  @Field()
  @IsNumber()
  totalCalories: number;

  @Field()
  @IsNumber()
  planCalories: number;
}
