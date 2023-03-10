import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class GetCaloryDto {
  @Field()
  @IsMongoId()
  caloryId!: string;

  @Field()
  @IsMongoId()
  clientId!: string;
}
