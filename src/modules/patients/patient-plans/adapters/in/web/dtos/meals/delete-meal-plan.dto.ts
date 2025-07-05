import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

@InputType()
export class DeletePlanMealDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsUUID(4)
  patient: string;

  @Field()
  @IsUUID(4)
  patientPlan: string;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(4, { each: true })
  meals: string[];
}
