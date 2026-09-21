import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsString, ValidateNested, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class GenearalObservation {
  @Field(() => String)
  @IsUUID(4)
  generalObservation!: string;

  @Field(() => String, { nullable: true })
  value!: string;
}
@InputType()
class FunctionalScreeningInput {
  @Field()
  @IsUUID(4)
  functionalScreening: string;

  @Field()
  @IsNumber()
  score: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  note?: string;
}

@InputType()
export class UpdateBiologicalTerrainAssessmentDto {
  @Field()
  @IsUUID(4)
  biologicalTerrainAssessment: string;

  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsString()
  patient: string;

  @Field(() => [GenearalObservation])
  @ValidateNested()
  @Type(() => GenearalObservation)
  generalObservations: GenearalObservation[];

  @Field(() => [FunctionalScreeningInput])
  @ValidateNested()
  @Type(() => FunctionalScreeningInput)
  functionalScreeningScores: FunctionalScreeningInput[];
}
