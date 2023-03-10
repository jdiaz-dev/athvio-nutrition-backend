import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class GetProgramDto {
  @Field()
  @IsMongoId()
  programId: string;
}
