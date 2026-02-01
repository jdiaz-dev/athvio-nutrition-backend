import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

@InputType()
export class DeleteMealDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsUUID(4)
  program: string;

  @Field()
  @IsUUID(4)
  plan: string;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(4, { each: true })
  meals: string[];
}
