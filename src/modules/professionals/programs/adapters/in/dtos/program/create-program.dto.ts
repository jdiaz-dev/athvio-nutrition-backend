import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsString } from 'class-validator';

@InputType()
export class CreateProgramDto {
  @Field()
  @IsMongoId()
  professionalId: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;
}

