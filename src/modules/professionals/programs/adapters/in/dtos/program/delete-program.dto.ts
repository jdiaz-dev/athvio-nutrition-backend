import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class DeleteProgramDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  program: string;
}
