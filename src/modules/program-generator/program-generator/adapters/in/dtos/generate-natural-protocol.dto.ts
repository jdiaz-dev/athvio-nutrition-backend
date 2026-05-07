import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsDate, IsUUID, IsNumber, Max } from 'class-validator';

@InputType()
export class GenerateNaturalProtocolDto {
  @Field(() => [String])
  @IsArray()
  clean: string[];

  @Field(() => [String])
  @IsArray()
  equilibrate: string[];

  @Field(() => [String])
  @IsArray()
  suplementate: string[];

  @Field()
  @IsUUID(4)
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
}
