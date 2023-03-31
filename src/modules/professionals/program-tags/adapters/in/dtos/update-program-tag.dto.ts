import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsString } from 'class-validator';

@InputType()
export class UpdateProgramTagDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  programTag: string;

  @Field()
  @IsString()
  title: string;
}
