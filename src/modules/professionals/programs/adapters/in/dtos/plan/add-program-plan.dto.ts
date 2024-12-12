import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {  IsMongoId, ValidateNested } from 'class-validator';
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
  @ValidateNested()
  @Type(() => PlanBodyInput)
  planBody: PlanBodyInput;
}
