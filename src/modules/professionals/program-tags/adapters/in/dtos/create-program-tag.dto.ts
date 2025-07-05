import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsString } from 'class-validator';

@InputType()
export class CreateProgramTagDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsString()
  title: string;
}
