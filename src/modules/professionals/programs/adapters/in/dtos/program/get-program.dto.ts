import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class GetProgramDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsUUID()
  program: string;

  plan?: string;
}

