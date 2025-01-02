import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class GetUserDto {
  @Field()
  @IsMongoId()
  user: string;
}
