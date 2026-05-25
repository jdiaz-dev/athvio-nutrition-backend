import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

@InputType()
export class DeletePatientProgramMealDto {
  @Field()
  @IsUUID(4)
  patient: string;

  @Field()
  @IsUUID(4)
  patientProgram: string;

  @Field()
  @IsUUID(4)
  plan: string;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(4, { each: true })
  meals: string[];
}
