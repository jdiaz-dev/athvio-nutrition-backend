import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsDate, IsMongoId, IsUUID } from 'class-validator';

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
  @IsMongoId()
  patient: string;

  @Field()
  @IsDate()
  startDate: Date;
}
