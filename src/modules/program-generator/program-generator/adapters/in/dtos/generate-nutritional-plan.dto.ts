import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsDate, IsMongoId } from 'class-validator';

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

  @Field()
  @IsDate()
  startDate: Date;

  @Field()
  @IsDate()
  endDate: Date;
}
