import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsString } from 'class-validator';

@InputType()
export class UpdateProgramTagDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsUUID()
  programTag: string;

  @Field()
  @IsString()
  title: string;
}
