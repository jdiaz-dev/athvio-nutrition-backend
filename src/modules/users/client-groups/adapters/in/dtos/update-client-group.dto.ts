import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsString } from 'class-validator';

@InputType()
export class UpdateClientGroupDto {
  @Field()
  @IsMongoId()
  clientGroupId: string;

  @Field()
  @IsString()
  title: string;
}
