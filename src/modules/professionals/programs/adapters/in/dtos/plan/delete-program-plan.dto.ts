import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class DeleteProgramPlanDto {
  @Field()
  @IsMongoId()
  professionalId: string;

  @Field()
  @IsMongoId()
  programId: string;

  @Field()
  @IsMongoId()
  planId: string;
}
