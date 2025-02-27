import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsMongoId } from 'class-validator';

@InputType()
export class DeletePlanMealDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  patient: string;

  @Field()
  @IsMongoId()
  patientPlan: string;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  meals: string[];
}
