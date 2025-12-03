import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { MacrosInput } from 'src/shared/adapters/in/dtos/macros-input.dto';

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

  @Field({ nullable: true })
  @IsUUID(4)
  @IsOptional()
  internalFood?: string;
}
