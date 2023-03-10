import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class DeletePlanDto {
  @Field()
  @IsString()
  programId: string;

  @Field()
  @IsString()
  planId: string;
}
