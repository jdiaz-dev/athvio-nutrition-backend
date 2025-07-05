import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateProgramDto {
  @Field()
  @IsUUID()
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
