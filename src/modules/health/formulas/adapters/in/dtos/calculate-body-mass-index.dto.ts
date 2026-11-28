import { Field, Float, InputType } from '@nestjs/graphql';
import { IsBoolean, IsIn, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { AllowedGender } from 'src/shared/enums/project';

@InputType()
export class CalculateBodyMassIndexDto {
  @Field(() => Float, { description: 'Edad en años' })
  @IsNumber()
  @Min(0)
  @Max(130)
  age: number;

  @Field(() => Float, { description: 'Talla en centímetros' })
  @IsNumber()
  @Min(30)
  @Max(260)
  height: number;

  @Field(() => Float, { description: 'Peso en kilogramos' })
  @IsNumber()
  @Min(1)
  @Max(500)
  weight: number;

  @Field(() => String)
  @IsIn([AllowedGender.MALE, AllowedGender.FEMALE])
  gender: AllowedGender;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isPregnant?: boolean;
}
