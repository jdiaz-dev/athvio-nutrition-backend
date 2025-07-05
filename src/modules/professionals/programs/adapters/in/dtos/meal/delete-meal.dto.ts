import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

@InputType()
export class DeleteMealDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsUUID()
  program: string;

  @Field()
  @IsUUID()
  plan: string;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID({ each: true })
  meals: string[];
}
