import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {  IsUUID, ValidateNested } from 'class-validator';
import { PlanBodyInput } from 'src/modules/professionals/programs/adapters/in/dtos/plan/plan-body.input';

@InputType()
export class AddProgramPlanDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsUUID()
  program: string;

  @Field()
  @ValidateNested()
  @Type(() => PlanBodyInput)
  planBody: PlanBodyInput;
}
