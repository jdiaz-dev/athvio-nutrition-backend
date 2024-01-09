import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsMongoId, IsInt, Min } from 'class-validator';
import { Plan } from 'src/modules/professionals/programs/adapters/out/program.schema';

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

  plans?: Plan[];

}
