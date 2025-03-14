import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class GetProgramTagsDto {
  @Field()
  @IsMongoId()
  professional: string;
}
