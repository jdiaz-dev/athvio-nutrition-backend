import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateProgramDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsString()
  @MaxLength(150)
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description: string;
}
