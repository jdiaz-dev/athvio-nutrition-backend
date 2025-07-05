import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeleteProgramTagDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsUUID()
  programTag: string;
}
