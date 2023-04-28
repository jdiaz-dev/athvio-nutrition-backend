import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { MacrosInput } from 'src/shared/dtos/macros-input.dto';

@InputType()
export class IngredientInput extends MacrosInput {
  @Field()
  @IsNumber()
  amount: number;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  label: string;
}
