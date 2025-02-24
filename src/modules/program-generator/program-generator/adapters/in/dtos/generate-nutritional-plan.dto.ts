import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsMongoId } from 'class-validator';

@InputType()
export class GenerateNutritionalPlanDto {
  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  diseaseCauses: string[];

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  nutritionalPreferences: string[];

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  diseases: string[];

  @Field()
  @IsMongoId()
  patient: string;

  /* @Field()
  @IsMongoId()
  startDate: string;

  @Field()
  @IsMongoId()
  endDate: string; */
}
