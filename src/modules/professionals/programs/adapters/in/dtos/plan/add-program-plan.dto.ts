import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNumber, IsMongoId, IsInt, Min, ValidateNested } from 'class-validator';
import { PlanBodyInput } from 'src/modules/professionals/programs/adapters/in/dtos/plan/plan-body.input';

@InputType()
export class AddProgramPlanDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  program: string;

  @Field()
  @IsNumber()
  @IsInt()
  @Min(1)
  week: number;

  @Field()
  @IsNumber()
  @IsInt()
  @Min(1)
  day: number;

  @Field()
  @ValidateNested()
  @Type(() => PlanBodyInput)
  planBody: PlanBodyInput;
}
