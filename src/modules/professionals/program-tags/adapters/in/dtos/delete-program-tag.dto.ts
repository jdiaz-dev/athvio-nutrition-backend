import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class DeleteProgramTagDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  programTag: string;
}
