import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateProgramDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description: string;
}
