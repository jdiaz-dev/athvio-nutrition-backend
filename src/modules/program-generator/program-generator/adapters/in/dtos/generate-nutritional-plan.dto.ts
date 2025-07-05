import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsDate, IsUUID, IsNumber, IsUUID, Max, ValidateNested } from 'class-validator';

@InputType()
export class PatientMacrosInput {
  @Field()
  @IsNumber()
  carbs: number;

  @Field()
  @IsNumber()
  protein: number;

  @Field()
  @IsNumber()
  fat: number;

  @Field()
  @IsNumber()
  calories: number;
}

const uuidV4 = 4;
@InputType()
export class GenerateNutritionalPlanDto {
  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(uuidV4, { each: true })
  diseaseCauses: string[];

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(uuidV4, { each: true })
  nutritionalPreferences: string[];

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(uuidV4, { each: true })
  diseases: string[];

  @Field()
  @IsUUID()
  patient: string;

  @Field()
  @IsDate()
  startDate: Date;

  @Field()
  @Max(7)
  @IsNumber()
  totalDays: number;

  @Field()
  @Max(4)
  @IsNumber()
  mealsByDay: number;

  @Field(() => PatientMacrosInput)
  @ValidateNested()
  @Type(() => PatientMacrosInput)
  macros: PatientMacrosInput;
}
