import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeleteProgramDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsUUID()
  program: string;
}
