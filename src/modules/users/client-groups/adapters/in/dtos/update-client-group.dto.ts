import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdateClientGroupDto {
  @Field()
  @IsString()
  _id: string;

  @Field()
  @IsString()
  title: string;
}
