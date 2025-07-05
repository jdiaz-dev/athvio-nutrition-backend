import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class GetUserDto {
  @Field()
  @IsUUID(4)
  user: string;
}
