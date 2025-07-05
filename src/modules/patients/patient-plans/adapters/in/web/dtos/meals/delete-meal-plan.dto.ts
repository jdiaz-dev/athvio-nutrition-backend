import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

@InputType()
export class DeletePlanMealDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsUUID()
  patient: string;

  @Field()
  @IsUUID()
  patientPlan: string;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID({ each: true })
  meals: string[];
}
