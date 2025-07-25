import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class GetCaloryDto {
  @Field()
  @IsUUID(4)
  patient!: string;
}
