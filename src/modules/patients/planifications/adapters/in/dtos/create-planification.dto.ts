import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsUUID, ValidateNested } from 'class-validator';

@InputType()
export class PatientInformation {
  @Field()
  @IsNumber()
  weight: number;

  @Field()
  height: number;

  @Field()
  @IsNumber()
  age: number;

  @Field()
  @IsNumber()
  gender: string;

  @Field()
  @IsNumber()
  activityFactor: number;
}

@InputType()
export class CalculatedMacros {
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

@InputType()
export class CreatePlanificationDto {
  @Field()
  @IsUUID(4)
  patient!: string;

  @Field(() => PatientInformation)
  @ValidateNested()
  patientInformation: PatientInformation;

  @Field(() => CalculatedMacros)
  @ValidateNested()
  configuredMacros!: CalculatedMacros;
}
