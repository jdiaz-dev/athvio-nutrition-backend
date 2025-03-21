import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { MacrosInput } from 'src/shared/dtos/macros-input.dto';

@InputType()
export class IngredientInput extends MacrosInput {
  @Field()
  @IsString()
  amount: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  label: string;
}
