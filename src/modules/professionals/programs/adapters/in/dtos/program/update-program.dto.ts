import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsString } from 'class-validator';

@InputType()
export class UpdateProgramDto {
  @Field()
  @IsMongoId()
  professionalId: string;

  @Field()
  @IsMongoId()
  programId: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;
}
