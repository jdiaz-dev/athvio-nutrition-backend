import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsString } from 'class-validator';

@InputType()
export class UpdateProgramTagDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsUUID(4)
  programTag: string;

  @Field()
  @IsString()
  title: string;
}
