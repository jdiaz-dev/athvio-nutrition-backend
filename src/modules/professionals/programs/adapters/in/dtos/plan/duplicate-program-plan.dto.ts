import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsMongoId, IsNumber, Min } from 'class-validator';
import { Plan } from 'src/modules/professionals/programs/adapters/out/program.schema';

@InputType()
export class DuplicateProgramPlanDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  program: string;

  @Field()
  @IsMongoId()
  plan: string;

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

  planToDuplicate?: Plan;
}
