import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsString } from 'class-validator';

@InputType()
export class CreateProgramTagDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsString()
  title: string;
}
